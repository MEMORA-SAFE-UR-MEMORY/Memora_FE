import { useCallback, useEffect, useState } from "react";
import { createRoom, fetchDoors, fetchRoomsByUser } from "./api";
import { Door, Room } from "./type";

// Lấy danh sách doors (màu + ảnh) cho modal
export function useDoors() {
  const [doors, setDoors] = useState<Door[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await fetchDoors();
        setDoors(list);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { doors, loading, error };
}

// Quản lý rooms của current user
export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const reload = useCallback(async (uid: string) => {
    const data = await fetchRoomsByUser(uid);
    setRooms(data);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // const uid = await getCurrentUserId();
        // chưa có auth nên để tạm hihi
        const uid = "9459cc55-0a45-4395-98cb-e2d6915ca2d8";
        if (!uid) {
          setLoading(false);
          return;
        }
        setUserId(uid);
        await reload(uid);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [reload]);

  const addRoom = useCallback(
    async (room_name: string, theme_key: string, door_id: number) => {
      if (!userId) throw new Error("Missing user id");
      const theme_id: number | null = null;
      const newRoom = await createRoom({
        room_name,
        theme_id,
        user_id: userId,
        door_id,
      });
      setRooms((prev) => [...prev, newRoom]);
      return newRoom;
    },
    [userId]
  );

  return { rooms, loading, error, addRoom, userId };
}
