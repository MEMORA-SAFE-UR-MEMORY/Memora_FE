import { createClient } from "@supabase/supabase-js";
import { Door, Room } from "./type";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;
if (!SUPABASE_URL) throw new Error("Missing env SUPABASE_URL");
if (!SUPABASE_KEY) throw new Error("Missing env SUPABASE_KEY");

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function fetchDoors(): Promise<Door[]> {
  const { data, error } = await supabase
    .from("doors")
    .select("id, img_url, created_at, color_hex")
    .order("id");
  if (error) throw error;
  return (data ?? []) as Door[];
}

export async function fetchRoomsByUser(userId: string): Promise<Room[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select(
      `
      id, room_name, theme_id, created_at, user_id, door_id,
      door:doors!rooms_door_id_fkey ( id, img_url, created_at, color_hex )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data as any[]).map((r) => ({
    ...r,
    door: r.door ?? undefined,
  })) as Room[];
}

export async function createRoom(payload: {
  room_name: string;
  theme_id?: number | null;
  user_id: string;
  door_id: number;
}): Promise<Room> {
  const { data, error } = await supabase
    .from("rooms")
    .insert([payload])
    .select(
      `
      id, room_name, theme_id, created_at, user_id, door_id,
      door:doors!rooms_door_id_fkey ( id, img_url, created_at, color_hex )
    `
    )
    .single();

  if (error) throw error;

  console.log("createRoom raw:", data);

  return {
    ...data,
    door: (data as any).door ?? undefined,
  } as Room;
}
