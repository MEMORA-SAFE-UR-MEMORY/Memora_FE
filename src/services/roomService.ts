import * as api from "@src/apis/roomApi";
import { roomRepo } from "@src/repositories/roomRepo";
import { Draft, Room, RoomDetail, RoomType } from "@src/types/room";

/** Lấy room, ưu tiên cache, fallback API */
export async function getRoom(roomId: number): Promise<Room> {
  const cached = await roomRepo.getFromCache(roomId);
  if (cached) return cached;

  const remote = await api.fetchRoomById(roomId);
  if (!remote) throw new Error("Room not found");

  await roomRepo.saveToCache(remote);
  return remote;
}

/**
 * Cập nhật room.type
 * - thực hiện cập nhật qua API
 * - cập nhật cache nếu thành công
 * - ném lỗi nếu thất bại
 */
export async function setRoomType(
  roomId: number,
  type: RoomType
): Promise<Room> {
  if (!["private", "public"].includes(type)) {
    throw new Error("Invalid room type");
  }

  const updated = await api.updateRoomTypeApi(roomId, type);
  await roomRepo.saveToCache(updated);
  return updated;
}

/**
 * Toggle (chuyển đổi) room.type: nếu private -> public, ngược lại.
 * Ưu tiên lấy type từ cache, nếu chưa có thì fallback gọi API.
 */
export async function toggleRoomType(roomId: number): Promise<Room> {
  let currentType: RoomType | null = null;

  // thử lấy từ cache
  const cached = await roomRepo.getFromCache(roomId);
  if (cached) {
    currentType = cached.type;
  } else {
    // fallback gọi API
    const remote = await api.fetchRoomById(roomId);
    if (!remote) {
      throw new Error("Room not found");
    }
    currentType = remote.type;
  }

  const newType: RoomType = currentType === "private" ? "public" : "private";
  return setRoomType(roomId, newType);
}

/** Lưu room + draft lên Supabase và xóa draft */
export async function saveRoom(room: RoomDetail, draft: Draft) {
  const result = await api.saveRoomToSupabase(room, draft);
  return result;
}
