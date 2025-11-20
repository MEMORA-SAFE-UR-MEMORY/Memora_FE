import { roomShareService } from "@src/services/roomService";
import { SharedRoom } from "@src/types/room";
import { useEffect, useState } from "react";

export const useSharedRoom = (userId?: string) => {
  const [rooms, setRooms] = useState<SharedRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const inviteUser = async (
    username: string,
    roomId: number,
    userId: string
  ) => {
    setLoading(true);
    const res = await roomShareService.invite(username, roomId, userId);
    setLoading(false);
    return res;
  };

  const fetchRooms = async () => {
    setLoading(true);
    if (!userId) return;
    const res = await roomShareService.getSharedRooms(userId);
    setLoading(false);

    if (res.success && res.data) {
      setRooms(res.data);
      setMsg("");
    } else {
      setMsg(res.msg || "Không thể lấy dữ liệu phòng được chia sẻ.");
    }
  };

  useEffect(() => {
    if (userId) fetchRooms();
  }, [userId]);

  return { inviteUser, rooms, loading, msg, refetch: fetchRooms };
};
