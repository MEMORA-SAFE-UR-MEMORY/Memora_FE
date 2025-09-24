import { Room, RoomDetail } from "@src/types/room";
import { useCallback, useRef, useState } from "react";

const mockRooms: Room[] = [
  {
    id: 1,
    themeId: 101,
    roomName: "Phòng cổ điển",
    userId: "user_1",
    doorId: "door_abc",
    createdAt: "2025-09-22",
  },
  {
    id: 2,
    themeId: 102,
    roomName: "Phòng hiện đại",
    userId: "user_1",
    doorId: "door_xyz",
    createdAt: "2025-09-22",
  },
];

export const useRoom = () => {
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // cache lưu chi tiết các phòng đã load
  const cacheRef = useRef<Record<number, RoomDetail>>({});

  const getRoomDetail = useCallback(async (roomId: number) => {
    // 1. Kiểm tra cache trước
    if (cacheRef.current[roomId]) {
      setRoomDetail(cacheRef.current[roomId]);
      return cacheRef.current[roomId];
    }

    try {
      setLoading(true);
      setError(null);

      // Mock data
      const detail: RoomDetail = {
        ...mockRooms.find((r) => r.id === roomId)!,
        theme: {
          id: 101,
          themeName: "Cổ điển",
          themePrice: 500,
          wallUrl: require("../../assets/roomBg/room-wall.png"),
          floorUrl: require("../../assets/roomBg/room-floor.png"),
          createdAt: "2025-08-01",
        },
        items: [],
      };

      // 2. Lưu cache
      cacheRef.current[roomId] = detail;

      setRoomDetail(detail);
      return detail;
    } catch (err: any) {
      setError(err.message || "Lỗi khi load phòng");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    rooms: mockRooms,
    roomDetail,
    loading,
    error,
    getRoomDetail,
  };
};
