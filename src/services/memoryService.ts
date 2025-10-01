import AsyncStorage from "@react-native-async-storage/async-storage";
import { Memory } from "@src/types/memory";

const STORE_KEY = (roomId: number) => `memories_${roomId}`;

export const memoryService = {
  loadStore: async (roomId: number): Promise<Record<number, Memory>> => {
    const raw = await AsyncStorage.getItem(STORE_KEY(roomId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Memory>;
    const normalized: Record<number, Memory> = {};
    Object.entries(parsed).forEach(([k, v]) => {
      normalized[Number(k)] = v;
    });
    return normalized;
  },

  saveStore: async (roomId: number, store: Record<number, Memory>) => {
    await AsyncStorage.setItem(STORE_KEY(roomId), JSON.stringify(store));
  },

  addOrUpdate: async (
    roomId: number,
    memory: Memory
  ): Promise<Record<number, Memory>> => {
    const store = await memoryService.loadStore(roomId);
    const updated = { ...store, [memory.id]: memory };
    await memoryService.saveStore(roomId, updated);
    return updated;
  },

  delete: async (
    roomId: number,
    memoryId: number
  ): Promise<Record<number, Memory>> => {
    const store = await memoryService.loadStore(roomId);
    delete store[memoryId];
    await memoryService.saveStore(roomId, store);
    return store;
  },
};
