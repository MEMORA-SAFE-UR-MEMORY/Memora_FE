import AsyncStorage from "@react-native-async-storage/async-storage";

const MEMORIES_KEY = (roomId: number) => `memories_${roomId}`;

// Lưu memories
export const saveMemories = async (roomId: number, memories: any[]) => {
  try {
    await AsyncStorage.setItem(MEMORIES_KEY(roomId), JSON.stringify(memories));
  } catch (err) {
    console.error("Error saving memories", err);
  }
};

// Load memories
export const loadMemories = async (roomId: number): Promise<any[]> => {
  try {
    const data = await AsyncStorage.getItem(MEMORIES_KEY(roomId));
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error loading memories", err);
    return [];
  }
};

// Xoá memories (khi clear room)
export const clearMemories = async (roomId: number) => {
  try {
    await AsyncStorage.removeItem(MEMORIES_KEY(roomId));
  } catch (err) {
    console.error("Error clearing memories", err);
  }
};
