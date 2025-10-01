// src/api/roomApi.ts
import { supabase } from "@src/lib/supabase";
import { Room, RoomType } from "@src/types/room";

export async function fetchRoomById(roomId: number): Promise<Room | null> {
  const { data, error } = await supabase
    .from("rooms")
    .select("id, room_name, theme_id, user_id, door_id, type, created_at")
    .eq("id", roomId)
    .single();

  if (error) throw error;
  if (!data) return null;

  const room: Room = {
    id: data.id,
    themeId: data.theme_id,
    roomName: data.room_name,
    userId: data.user_id,
    doorId: data.door_id,
    type: data.type,
    createdAt: data.created_at,
  };

  return room;
}

export async function updateRoomTypeApi(
  roomId: number,
  type: RoomType
): Promise<Room> {
  const { data, error } = await supabase
    .from("rooms")
    .update({ type })
    .eq("id", roomId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
