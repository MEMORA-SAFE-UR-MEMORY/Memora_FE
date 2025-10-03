import { getDraft, removeDraft, saveDraft } from "@src/repositories/draftRepo";
import { InventoryService } from "@src/services/inventoryService";
import { RoomItem } from "@src/types/item";
import { Draft, DraftOp, RoomDetail } from "@src/types/room";
import { generateTempId } from "@src/utils/idGenerator";

// In-memory cache để tránh parse nhiều lần
let inMemoryDrafts: Record<number, Draft> = {};
let saveTimers: Record<number, NodeJS.Timeout | number | null> = {};
const DEBOUNCE_MS = 400;

const nowISO = () => new Date().toISOString();

const loadIntoMemory = async (roomId: number) => {
  if (inMemoryDrafts[roomId]) return inMemoryDrafts[roomId];
  const d = await getDraft(roomId);
  if (d) inMemoryDrafts[roomId] = d;
  return d ?? null;
};

// compactDraft: chỉ giữ trạng thái cuối của từng item
function compactDraft(draft: Draft): Draft {
  const state: Record<number, any> = {}; // lưu trạng thái cuối cùng của mỗi item
  const removePatches: DraftOp[] = []; // lưu patch removeItem
  const slotMemoriesMap: Record<number, Record<number, number | null>> = {}; // lưu slotMemories cuối cùng

  for (const p of draft.patches) {
    const id = (p as any).itemId ?? (p as any).roomItemId;
    if (!id) continue;

    switch (p.op) {
      case "removeItem":
        removePatches.push(p); 
        delete state[id]; 
        delete slotMemoriesMap[id]; 
        break;

      case "upsertItem":
        state[id] = {
          ...state[id],
          ...p,
          rotation: p.rotation ?? state[id]?.rotation ?? 0,
        };
        break;

      case "setSlotMemory":
      case "updateSlotMemory":
        if (!slotMemoriesMap[id]) slotMemoriesMap[id] = {};
        slotMemoriesMap[id][p.slotId] = p.memoryId;
        break;

      case "deleteSlotMemory":
        if (!slotMemoriesMap[id]) slotMemoriesMap[id] = {};
        slotMemoriesMap[id][p.slotId] = null;
        break;
    }
  }

  const newPatches: DraftOp[] = [];

  // 1. Thêm các patch removeItem trước tiên
  newPatches.push(...removePatches);

  // 2. Thêm patch upsertItem
  for (const [idStr, st] of Object.entries(state)) {
    const id = Number(idStr);
    const { slotMemories, ...base } = st;

    newPatches.push({
      ...base,
      op: "upsertItem",
      rotation: base.rotation ?? 0,
    } as DraftOp);

    // 3. Thêm slotMemories cho item
    const smMap = slotMemoriesMap[id];
    if (smMap) {
      for (const [slotIdStr, memId] of Object.entries(smMap)) {
        newPatches.push({
          op: "setSlotMemory",
          roomItemId: id,
          slotId: Number(slotIdStr),
          memoryId: memId,
        } as DraftOp);
      }
    }
  }

  return {
    ...draft,
    patches: newPatches,
  };
}
const persistRoomDraft = async (roomId: number) => {
  const draft = inMemoryDrafts[roomId];
  if (draft) {
    compactDraft(draft);
    await saveDraft(roomId, draft);
  } else {
    await removeDraft(roomId);
  }
};

// squash patch: merge các thay đổi lặp cho cùng 1 item
const trySquash = (draft: Draft, patch: DraftOp) => {
  switch (patch.op) {
    case "upsertItem": {
      const { itemId } = patch;
      const idx = draft.patches.findIndex(
        (p) => p.op === "upsertItem" && (p as any).itemId === itemId
      );
      if (idx >= 0) {
        draft.patches[idx] = {
          ...(draft.patches[idx] as any),
          ...patch,
          rotation:
            (patch as any).rotation ??
            (draft.patches[idx] as any).rotation ??
            0,
        };
      } else {
        draft.patches.push({
          ...patch,
          rotation: patch.rotation ?? 0,
        });
      }
      return true;
    }

    case "removeItem": {
      const { itemId } = patch;
      draft.patches = draft.patches.filter(
        (p) => !(p.op === "upsertItem" && (p as any).itemId === itemId)
      );
      draft.patches.push(patch);
      return true;
    }

    case "setSlotMemory":
    case "updateSlotMemory": {
      const { roomItemId, slotId } = patch;
      draft.patches = draft.patches.filter(
        (p) =>
          !(
            (p.op === "setSlotMemory" || p.op === "updateSlotMemory") &&
            (p as any).roomItemId === roomItemId &&
            (p as any).slotId === slotId
          )
      );
      draft.patches.push(patch);
      return true;
    }
  }

  return false;
};

export const DraftManager = {
  savePatch: async (roomId: number, patch: DraftOp) => {
    let draft = inMemoryDrafts[roomId];
    if (!draft) {
      const loaded = await loadIntoMemory(roomId);
      draft = loaded ?? {
        roomId,
        lastEdited: nowISO(),
        patches: [],
      };
    }

    draft.lastEdited = nowISO();

    if (patch.op === "upsertItem") {
      if (!patch.itemId) {
        (patch as any).itemId = generateTempId();
      }
    }

    const squashed = trySquash(draft, patch);
    if (!squashed) draft.patches.push(patch);

    inMemoryDrafts[roomId] = draft;

    if (saveTimers[roomId]) clearTimeout(saveTimers[roomId] as any);
    saveTimers[roomId] = setTimeout(async () => {
      await persistRoomDraft(roomId);
      saveTimers[roomId] = null;
    }, DEBOUNCE_MS);
  },

  loadDraft: async (roomId: number) => {
    return await loadIntoMemory(roomId);
  },

  clearDraft: async (roomId: number) => {
    delete inMemoryDrafts[roomId];
    if (saveTimers[roomId]) clearTimeout(saveTimers[roomId] as any);
    await removeDraft(roomId);
  },

  applyDraft: (room: RoomDetail, draft: Draft) => {
    let result: RoomDetail = { ...room, items: [...(room.items ?? [])] };

    for (const p of draft.patches) {
      switch (p.op) {
        case "upsertItem": {
          const { itemId, refItemId, x, y, zIndex, rotation } = p;
          const invItem = InventoryService.getItemById(refItemId);
          if (!invItem) break;

          const newItem: RoomItem = {
            id: Number(itemId),
            x,
            y,
            zIndex,
            rotation: rotation ?? 0,
            item: invItem.item,
          };

          const idx = result.items.findIndex((it) => it.id === itemId);
          if (idx >= 0) {
            result.items[idx] = { ...result.items[idx], ...newItem };
          } else {
            result.items.push(newItem);
          }
          break;
        }

        case "removeItem": {
          const { itemId } = p;
          result.items = result.items.filter((it) => it.id !== itemId);
          break;
        }

        case "setSlotMemory":
        case "updateSlotMemory": {
          const { roomItemId, slotId, memoryId } = p;
          result.items = result.items.map((it) => {
            if (it.id !== roomItemId) return it;
            const sm = { ...(it.slotMemories ?? {}) };
            sm[slotId] = memoryId;
            return { ...it, slotMemories: sm };
          });
          break;
        }

        case "deleteSlotMemory": {
          const { roomItemId, slotId } = p;
          result.items = result.items.map((it) => {
            if (it.id !== roomItemId) return it;
            const sm = { ...(it.slotMemories ?? {}) } as Record<string, any>;
            delete sm[slotId];
            return { ...it, slotMemories: sm };
          });
          break;
        }
      }
    }

    return result;
  },

  compactDraft,
};
