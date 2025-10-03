import AsyncStorage from "@react-native-async-storage/async-storage";
import { Memory } from "@src/types/memory";

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

  // Xoá toàn bộ memories của 1 room
  clearStore: async (roomId: number) => {
    await AsyncStorage.removeItem(STORE_KEY(roomId));
  },
};
