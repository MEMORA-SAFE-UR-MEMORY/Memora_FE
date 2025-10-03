import * as api from "@src/apis/roomApi";
import { Draft, Room, RoomDetail, RoomType } from "@src/types/room";

export const roomRepo = {
  async getRoom(roomId: number): Promise<RoomDetail> {
    const room = await api.fetchRoomById(roomId);
    if (!room) throw new Error("Room not found");
    return room;
  },

  async updateRoomType(roomId: number, type: RoomType): Promise<Room> {
    return api.updateRoomTypeApi(roomId, type);
  },

  async saveRoom(room: RoomDetail, draft: Draft) {
    return api.saveRoomToSupabase(room, draft);
  },
};
