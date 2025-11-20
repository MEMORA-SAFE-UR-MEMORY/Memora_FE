import * as api from "@src/apis/roomApi";
import { SuggestReq, SuggestRes } from "@src/types/memory";
import { Draft, Room, RoomDetail, RoomType, SharedRoom } from "@src/types/room";
import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from "@src/utils/roomStorage";

const DISCOVERED_ROOMS_KEY = "discovered_rooms";
const PUBLIC_ROOMS_CACHE_KEY = "public_rooms_cache";
const PUBLIC_ROOMS_FETCH_TIME_KEY = "public_rooms_last_fetch";
const ONE_DAY = 24 * 60 * 60 * 1000;

export const roomRepo = {
  async getRoom(roomId: number): Promise<RoomDetail> {
    const room = await api.fetchRoomById(roomId);
    if (!room) throw new Error("Room not found");
    return room;
  },

  async updateRoomType(roomId: number, type: RoomType): Promise<Room> {
    return api.updateRoomTypeApi(roomId, type);
  },

  async saveRoom(room: RoomDetail, draft: Draft, initialType: RoomType) {
    return api.saveRoomToSupabase(room, draft, initialType);
  },

  getPublicRooms: async (userId: string): Promise<Room[] | null> => {
    const now = Date.now();
    const lastFetch = await getFromStorage(PUBLIC_ROOMS_FETCH_TIME_KEY);
    const cachedRooms = await getFromStorage(PUBLIC_ROOMS_CACHE_KEY);
    const discovered = (await getFromStorage(DISCOVERED_ROOMS_KEY)) || [];

    let rooms: Room[] = [];

    const shouldRefetch =
      !cachedRooms || !lastFetch || now - lastFetch > ONE_DAY;

    if (shouldRefetch) {
      // Fetch API mới
      const fetchedRooms = await api.fetchPublicRooms(userId);
      rooms = fetchedRooms.map(
        (r: any): Room => ({
          id: r.id,
          themeId: r.user_themes?.theme_id ?? r.theme_id,
          type: r.type,
        })
      );
      await saveToStorage(PUBLIC_ROOMS_CACHE_KEY, rooms);
      await saveToStorage(PUBLIC_ROOMS_FETCH_TIME_KEY, now);
    } else {
      rooms = cachedRooms;
    }

    // Loại bỏ phòng đã khám phá
    const undiscoveredRooms = rooms.filter(
      (room: Room) => !discovered.includes(room.id)
    );

    if (undiscoveredRooms.length === 0) {
      return null;
    }

    return undiscoveredRooms;
  },

  /** Lưu room đã khám phá */
  markRoomAsDiscovered: async (roomId: number): Promise<void> => {
    const discovered = (await getFromStorage(DISCOVERED_ROOMS_KEY)) || [];
    if (!discovered.includes(roomId)) {
      discovered.push(roomId);
      await saveToStorage(DISCOVERED_ROOMS_KEY, discovered);
    }
  },

  /** Reset danh sách khám phá */
  resetDiscoveredRooms: async (): Promise<void> => {
    await saveToStorage(DISCOVERED_ROOMS_KEY, []);
  },

  clearRoomStorage: async (): Promise<void> => {
    await removeFromStorage(PUBLIC_ROOMS_CACHE_KEY);
    await removeFromStorage(PUBLIC_ROOMS_FETCH_TIME_KEY);
    await removeFromStorage(DISCOVERED_ROOMS_KEY);
  },

  suggestDescription: async (payload: SuggestReq): Promise<SuggestRes> => {
    const formData = new FormData();

    formData.append("Title", payload.title);
    formData.append("Date", payload.date);

    let uri = "";
    let type = "";
    let name = "upload.jpg";

    if (typeof payload.image === "string") {
      uri = payload.image;
      const ext = uri.split(".").pop()?.toLowerCase();
      if (ext === "png" || ext === "jpg" || ext === "jpeg") {
        type = ext === "png" ? "image/png" : "image/jpeg";
        name = `upload.${ext}`;
      } else {
        throw new Error("Chỉ chấp nhận ảnh PNG hoặc JPEG");
      }
    } else if (payload.image?.uri) {
      uri = payload.image.uri;
      type = payload.image.type || "image/jpeg";
      name = payload.image.fileName || "upload.jpg";
    }

    formData.append("Image", { uri, type, name } as any);

    const res = await api.suggestDescription(formData);
    return {
      suggestedDescription:
        res.suggestedDescription || res.SuggestedDescription || "",
    };
  },

  deleteMemory: async (memoryId: number) => {
    const res = await api.deleteMemory(memoryId);

    return res;
  },

  // Share link
  getUserByUsername: async (username: string) => {
    const { data, error } = await api.roomShareApi.findUserByUsername(username);
    if (error || !data) return null;
    return data;
  },

  isUserAlreadyInvited: async (roomId: number, userId: string) => {
    const { data, error } = await api.roomShareApi.checkExistingInvite(
      roomId,
      userId
    );
    if (error) return null;
    return data !== null;
  },

  inviteUser: async (
    roomId: number,
    invitedUserId: string,
    invitedBy: string
  ) => {
    const { error } = await api.roomShareApi.insertInvite(
      roomId,
      invitedUserId,
      invitedBy
    );
    return !error;
  },

  getSharedRooms: async (userId: string): Promise<SharedRoom[]> => {
    const { data, error } = await api.roomShareApi.getSharedRoomsByUser(userId);

    if (error || !data) return [];

    return data.map((item: any) => ({
      id: item.id,
      roomShareId: item.room_id,
      themeId: item.rooms?.user_theme?.theme_id,
      ownerId: item.invited_by,
      roomName: item.rooms?.room_name || "Không có tên",
      ownerName: item.users?.username || "Ẩn danh",
    }));
  },
};
