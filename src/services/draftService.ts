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

// 🧹 compactDraft: dọn sạch patch thừa
function compactDraft(draft: Draft) {
  const state: Record<number, any> = {}; // trạng thái cuối của từng item
  const removed: Set<number> = new Set();

  for (const p of draft.patches) {
    const id = (p as any).itemId ?? (p as any).roomItemId;
    if (!id) continue;

    if (p.op === "removeItem") {
      delete state[id];
      removed.add(id);
      continue;
    }

    if (!state[id]) {
      if (p.op === "addItem") {
        state[id] = { ...p }; // khởi tạo item mới
      }
      continue; // bỏ patch lẻ không có addItem trước
    }

    switch (p.op) {
      case "moveItem":
        state[id].x = p.x;
        state[id].y = p.y;
        state[id].zIndex = p.zIndex;
        break;
      case "rotateItem":
        state[id].rotation = p.rotation;
        break;
      case "setSlotMemory":
      case "updateSlotMemory":
        state[id].slotMemories = {
          ...(state[id].slotMemories ?? {}),
          [p.slotId]: p.memoryId,
        };
        break;
      case "deleteSlotMemory":
        if (state[id].slotMemories) {
          delete state[id].slotMemories[p.slotId];
        }
        break;
    }
  }

  // build lại patches gọn nhất
  const newPatches: DraftOp[] = [];
  for (const [id, st] of Object.entries(state)) {
    if (removed.has(Number(id))) continue;
    const { slotMemories, ...base } = st;
    newPatches.push(base as DraftOp);

    if (slotMemories) {
      for (const [slotId, memId] of Object.entries(slotMemories)) {
        newPatches.push({
          op: "setSlotMemory",
          roomItemId: Number(id),
          slotId: Number(slotId),
          memoryId: memId as number | null,
        });
      }
    }
  }

  draft.patches = newPatches;
}

const persistRoomDraft = async (roomId: number) => {
  const draft = inMemoryDrafts[roomId];
  if (draft) {
    compactDraft(draft); // cleanup trước khi lưu
    await saveDraft(roomId, draft);
  } else {
    await removeDraft(roomId);
  }
};

const trySquash = (draft: Draft, patch: DraftOp) => {
  const patches = draft.patches;

  switch (patch.op) {
    case "moveItem": {
      const { itemId } = patch as any;
      draft.patches = patches.filter(
        (p) => !(p.op === "moveItem" && (p as any).itemId === itemId)
      );
      draft.patches.push(patch);
      return true;
    }

    case "rotateItem": {
      const { itemId } = patch as any;
      draft.patches = patches.filter(
        (p) => !(p.op === "rotateItem" && (p as any).itemId === itemId)
      );
      draft.patches.push(patch);
      return true;
    }

    case "setSlotMemory": {
      const { roomItemId, slotId } = patch as any;
      draft.patches = patches.filter(
        (p) =>
          !(
            p.op === "setSlotMemory" &&
            (p as any).roomItemId === roomItemId &&
            (p as any).slotId === slotId
          )
      );
      draft.patches.push(patch);
      return true;
    }

    case "updateSlotMemory": {
      const { roomItemId, slotId } = patch as any;
      draft.patches = patches.filter(
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

    case "removeItem": {
      const { itemId } = patch as any;
      draft.patches = patches.filter(
        (p) =>
          !((p as any).itemId === itemId || (p as any).roomItemId === itemId)
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

    // addItem → đảm bảo có tempId
    if (patch.op === "addItem" && !patch.itemId) {
      (patch as any).itemId = generateTempId();
    }

    const squashed = trySquash(draft, patch);
    if (!squashed) draft.patches.push(patch);

    inMemoryDrafts[roomId] = draft;

    // debounce persist
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
        case "addItem": {
          const { itemId, refItemId, x, y, zIndex } = p;
          const invItem = InventoryService.getItemById(refItemId);
          if (!invItem) break;
          const newItem: RoomItem = {
            id: Number(itemId),
            x,
            y,
            zIndex,
            item: invItem.item,
          };
          result.items.push(newItem);
          break;
        }

        case "moveItem": {
          const { itemId, x, y, zIndex } = p as any;
          result.items = result.items.map((it) =>
            it.id === itemId ? { ...it, x, y, zIndex } : it
          );
          break;
        }

        case "rotateItem": {
          const { itemId, rotation } = p as any;
          result.items = result.items.map((it) =>
            it.id === itemId ? { ...it, rotation } : it
          );
          break;
        }

        case "removeItem": {
          const { itemId } = p as any;
          result.items = result.items.filter((it) => it.id !== itemId);
          break;
        }

        case "setSlotMemory":
        case "updateSlotMemory": {
          const { roomItemId, slotId, memoryId } = p as any;
          result.items = result.items.map((it) => {
            if (it.id !== roomItemId) return it;
            const sm = { ...(it.slotMemories ?? {}) };
            sm[slotId] = memoryId;
            return { ...it, slotMemories: sm };
          });
          break;
        }

        case "deleteSlotMemory": {
          const { roomItemId, slotId } = p as any;
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
