import { roomRepo } from "@src/repositories/roomRepo";
import { DraftManager } from "@src/services/draftService";
import { Draft, Room, RoomDetail, RoomType } from "@src/types/room";
import { getFromStorage, saveToStorage } from "@src/utils/roomStorage";

const LAST_RESET_KEY = "last_discovered_reset";
const ONE_DAY = 24 * 60 * 60 * 1000;

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
export async function saveRoom(
  room: RoomDetail,
  draft: Draft,
  initialType: RoomType
) {
  return roomRepo.saveRoom(room, draft, initialType);
}

/** Khởi tạo lịch sử khám phá (reset sau 1 ngày) */
export async function initDiscoveredRooms(): Promise<void> {
  const lastReset = await getFromStorage(LAST_RESET_KEY);
  const now = Date.now();

  if (!lastReset || now - lastReset > ONE_DAY) {
    await roomRepo.resetDiscoveredRooms();
    await saveToStorage(LAST_RESET_KEY, now);
  }
}

/** Lấy room công khai kế tiếp để khám phá */
export async function getNextRoomToDiscover(
  userId: string,
  currentRoomId?: number
): Promise<Room | null> {
  // Nếu có room hiện tại → đánh dấu đã khám phá trước
  if (currentRoomId) {
    await roomRepo.markRoomAsDiscovered(currentRoomId);
  }

  const availableRooms = await roomRepo.getPublicRooms(userId);

  // Nếu đã khám phá hết, trả null
  if (!availableRooms || availableRooms.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableRooms.length);
  const nextRoom = availableRooms[randomIndex];

  return nextRoom;
}

/** Đánh dấu room đã khám phá (nếu bạn muốn gọi thủ công chứ không auto) */
export async function markRoomDiscovered(roomId: number): Promise<void> {
  await roomRepo.markRoomAsDiscovered(roomId);
}

/** Reset thủ công lịch sử khám phá (ngoài auto 1 ngày) */
export async function resetDiscoveredRooms(): Promise<void> {
  await roomRepo.resetDiscoveredRooms();
  await saveToStorage(LAST_RESET_KEY, Date.now());
}
