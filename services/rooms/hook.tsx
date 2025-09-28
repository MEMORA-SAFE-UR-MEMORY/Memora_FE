import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { createRoom, deleteRoom, fetchDoors, fetchRoomsByUser } from "./api";
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
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        let uid: string | null = null;

        const userStr = await AsyncStorage.getItem("user");
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            uid = user?.id ?? user?.user_id ?? null;
          } catch {
            // ignore parse error
          }
        }
        if (!uid) {
          uid = (await AsyncStorage.getItem("userId")) ?? null;
        }

        if (!mounted) return;

        if (!uid) {
          setUserId(null);
          return;
        }

        setUserId(uid);
        await reload(uid);
      } catch (e) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
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

  const removeRoom = useCallback(
    async (roomId: number) => {
      const prev = rooms;
      setRooms((curr) => curr.filter((r) => r.id !== roomId));
      try {
        await deleteRoom(roomId);
      } catch (e) {
        setRooms(prev);
        throw e;
      }
    },
    [rooms]
  );

  return { rooms, loading, error, addRoom, removeRoom, userId };
}
