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

const persistRoomDraft = async (roomId: number) => {
  if (inMemoryDrafts[roomId]) {
    await saveDraft(roomId, inMemoryDrafts[roomId]);
  } else {
    await removeDraft(roomId);
  }
};

// squash rules: merge sequential ops when applicable
const trySquash = (draft: Draft, patch: DraftOp) => {
  const last = draft.patches[draft.patches.length - 1];
  if (!last) return false;

  // moveItem squash
  if (
    patch.op === "moveItem" &&
    last.op === "moveItem" &&
    last.itemId === patch.itemId
  ) {
    (last as any).x = patch.x;
    (last as any).y = patch.y;
    return true;
  }

  // rotateItem squash
  if (
    patch.op === "rotateItem" &&
    last.op === "rotateItem" &&
    last.itemId === patch.itemId
  ) {
    (last as any).rotation = (patch as any).rotation;
    return true;
  }

  // setSlotMemory squash
  if (
    patch.op === "setSlotMemory" &&
    last.op === "setSlotMemory" &&
    (last as any).roomItemId === (patch as any).roomItemId &&
    (last as any).slotId === (patch as any).slotId
  ) {
    (last as any).memoryId = (patch as any).memoryId;
    return true;
  }

  // updateSlotMemory squash
  if (
    patch.op === "updateSlotMemory" &&
    last.op === "updateSlotMemory" &&
    (last as any).roomItemId === (patch as any).roomItemId &&
    (last as any).slotId === (patch as any).slotId
  ) {
    (last as any).memoryId = (patch as any).memoryId;
    return true;
  }

  // setSlotMemory + updateSlotMemory squash
  if (
    patch.op === "updateSlotMemory" &&
    last.op === "setSlotMemory" &&
    last.roomItemId === patch.roomItemId &&
    last.slotId === patch.slotId
  ) {
    last.memoryId = patch.memoryId;
    return true;
  }

  // addItem + removeItem squash
  if (
    patch.op === "removeItem" &&
    last.op === "addItem" &&
    last.itemId === patch.itemId
  ) {
    draft.patches.pop(); // xoá addItem
    return true;
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

    // nếu là addItem mà chưa có id thì tạo tempId
    if (patch.op === "addItem") {
      if (!patch.itemId) {
        (patch as any).itemId = generateTempId();
      }
    }

    const squashed = trySquash(draft, patch);
    if (!squashed) draft.patches.push(patch);

    inMemoryDrafts[roomId] = draft;

    // debounce persist xuống AsyncStorage
    if (saveTimers[roomId]) {
      clearTimeout(saveTimers[roomId] as any);
    }
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

        default:
          break;
      }
    }

    return result;
  },
};
