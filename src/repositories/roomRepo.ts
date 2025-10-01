import AsyncStorage from "@react-native-async-storage/async-storage";
import { Room } from "@src/types/room";

const ROOM_CACHE_PREFIX = "room_detail:";

export const roomStorageKey = (roomId: number) => `${ROOM_CACHE_PREFIX}${roomId}`;

export const roomRepo = {
  async saveToCache(room: Room) {
    try {
      await AsyncStorage.setItem(roomStorageKey(room.id), JSON.stringify(room));
    } catch (err) {
      console.warn("roomRepo.saveToCache error", err);
    }
  },

  async getFromCache(roomId: number): Promise<Room | null> {
    try {
      const raw = await AsyncStorage.getItem(roomStorageKey(roomId));
      if (!raw) return null;
      return JSON.parse(raw) as Room;
    } catch (err) {
      console.warn("roomRepo.getFromCache error", err);
      return null;
    }
  },

  async removeCache(roomId: number) {
    try {
      await AsyncStorage.removeItem(roomStorageKey(roomId));
    } catch (err) {
      console.warn("roomRepo.removeCache error", err);
    }
  }
};
