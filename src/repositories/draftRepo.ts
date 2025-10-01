import AsyncStorage from "@react-native-async-storage/async-storage";
import { Draft } from "@src/types/room";

// Key cho từng room
const ROOM_DRAFT_KEY = (roomId: number) => `room_draft_${roomId}`;

// Lấy draft của 1 room
export const getDraft = async (roomId: number): Promise<Draft | null> => {
  const raw = await AsyncStorage.getItem(ROOM_DRAFT_KEY(roomId));
  return raw ? (JSON.parse(raw) as Draft) : null;
};

// Lưu draft của 1 room
export const saveDraft = async (roomId: number, draft: Draft) => {
  await AsyncStorage.setItem(ROOM_DRAFT_KEY(roomId), JSON.stringify(draft));
};

// Xoá draft của 1 room
export const removeDraft = async (roomId: number) => {
  await AsyncStorage.removeItem(ROOM_DRAFT_KEY(roomId));
};

// Nếu vẫn cần lấy tất cả draft (cho debug/clear cache)
export const getAllDrafts = async (): Promise<Record<number, Draft>> => {
  const keys = await AsyncStorage.getAllKeys();
  const roomKeys = keys.filter((k) => k.startsWith("room_draft_"));
  const entries = await AsyncStorage.multiGet(roomKeys);

  const result: Record<number, Draft> = {};
  for (const [key, value] of entries) {
    if (value) {
      const roomId = Number(key.replace("room_draft_", ""));
      result[roomId] = JSON.parse(value) as Draft;
    }
  }
  return result;
};
