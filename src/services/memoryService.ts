import AsyncStorage from "@react-native-async-storage/async-storage";
import { Memory } from "@src/types/memory";
import { generateTempId } from "@src/utils/idGenerator";

const STORE_KEY = (roomId: number) => `memories_${roomId}`;

/**
 * Cấu trúc dữ liệu localStore:
 * {
 *   [roomItemId]: {
 *     [slotId]: Memory
 *   }
 * }
 */
export type MemoryStore = Record<number, Record<number, Memory>>;

export const memoryService = {
  // Load store từ AsyncStorage
  loadStore: async (roomId: number): Promise<MemoryStore> => {
    const raw = await AsyncStorage.getItem(STORE_KEY(roomId));
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw) as MemoryStore;
      return parsed;
    } catch (e) {
      console.error("Failed to parse memory store", e);
      return {};
    }
  },

  // Save store vào AsyncStorage
  saveStore: async (roomId: number, store: MemoryStore) => {
    await AsyncStorage.setItem(STORE_KEY(roomId), JSON.stringify(store));
  },

  // Thêm hoặc cập nhật 1 memory vào đúng roomItemId + slotId
  setMemory: async (
    roomId: number,
    roomItemId: number,
    slotId: number,
    memory: Memory
  ): Promise<MemoryStore> => {
    const store = await memoryService.loadStore(roomId);
    const itemStore = store[roomItemId] ?? {};
    store[roomItemId] = { ...itemStore, [slotId]: memory };
    await memoryService.saveStore(roomId, store);
    return store;
  },

  // Lấy memory cụ thể theo roomItemId + slotId
  getMemory: async (
    roomId: number,
    roomItemId: number,
    slotId: number
  ): Promise<Memory | null> => {
    const store = await memoryService.loadStore(roomId);
    return store[roomItemId]?.[slotId] ?? null;
  },

  // Xoá 1 memory trong slot
  deleteMemory: async (
    roomId: number,
    roomItemId: number,
    slotId: number
  ): Promise<MemoryStore> => {
    const store = await memoryService.loadStore(roomId);
    if (store[roomItemId]) {
      delete store[roomItemId][slotId];
      if (Object.keys(store[roomItemId]).length === 0) {
        delete store[roomItemId]; // clean nếu item không còn slot nào
      }
    }
    await memoryService.saveStore(roomId, store);
    return store;
  },

  deleteFrameMemory: async (
    roomId: number,
    roomItemId: number
  ): Promise<MemoryStore> => {
    const store = await memoryService.loadStore(roomId);

    if (store[roomItemId]) {
      // Xóa toàn bộ frame đó
      delete store[roomItemId];
    }

    await memoryService.saveStore(roomId, store);
    return store;
  },

  // Xoá toàn bộ memories của 1 room
  clearStore: async (roomId: number) => {
    await AsyncStorage.removeItem(STORE_KEY(roomId));
  },

  updateStoreIds: async (
    roomId: number,
    idMap: Record<string | number, number>
  ) => {
    const store = await memoryService.loadStore(roomId);
    if (!store) return;

    const newStore: Record<number, any> = {};

    for (const [oldItemId, slotMap] of Object.entries(store)) {
      const newItemId = idMap[oldItemId];
      if (newItemId) {
        newStore[newItemId] = slotMap;
      } else {
        newStore[Number(oldItemId)] = slotMap;
      }
    }

    await memoryService.saveStore(roomId, newStore);
  },

  updateMemoryIds: async (
    roomId: number,
    memoryIdMap: Record<string | number, number>
  ) => {
    const store = await memoryService.loadStore(roomId);
    if (!store) return;

    for (const [itemId, slotMap] of Object.entries(store)) {
      const numericItemId = Number(itemId);

      for (const [slotId, mem] of Object.entries(slotMap)) {
        const numericSlotId = Number(slotId);
        const newMemId = memoryIdMap[mem.id];

        if (newMemId) {
          store[numericItemId][numericSlotId] = { ...mem, id: newMemId };
        }
      }
    }

    await memoryService.saveStore(roomId, store);
  },

  resetMemoryIds: async (roomId: number) => {
    const store = await memoryService.loadStore(roomId);
    const newStore: MemoryStore = {};

    Object.entries(store).forEach(([itemId, slotMap]) => {
      const newSlotMap: Record<number, any> = {};
      Object.entries(slotMap).forEach(([slotId, mem]) => {
        newSlotMap[+slotId] = { ...mem, id: generateTempId() };
      });
      newStore[+itemId] = newSlotMap;
    });

    await memoryService.saveStore(roomId, newStore);
  },
};
