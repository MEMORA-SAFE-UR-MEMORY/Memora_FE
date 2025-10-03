import { roomRepo } from "@src/repositories/roomRepo";
import { DraftManager } from "@src/services/draftService";
import { Draft, Room, RoomDetail, RoomType } from "@src/types/room";

export async function getRoom(roomId: number): Promise<RoomDetail> {
  const room = await roomRepo.getRoom(roomId);
  const draft = await DraftManager.loadDraft(roomId);
  if (draft) {
    return DraftManager.applyDraft(room, draft); 
  }
  return room;
}

/** Set room type */
export async function setRoomType(
  roomId: number,
  type: RoomType
): Promise<Room> {
  if (!["private", "public"].includes(type)) {
    throw new Error("Invalid room type");
  }
  return roomRepo.updateRoomType(roomId, type);
}

/** Toggle room type (logic ở service, repo không cần biết) */
export async function toggleRoomType(roomId: number): Promise<Room> {
  const room = await roomRepo.getRoom(roomId);
  const newType: RoomType = room.type === "private" ? "public" : "private";
  return setRoomType(roomId, newType);
}

/** Save room + draft */
export async function saveRoom(room: RoomDetail, draft: Draft) {
  return roomRepo.saveRoom(room, draft);
}
