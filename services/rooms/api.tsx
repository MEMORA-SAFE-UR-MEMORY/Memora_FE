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
      door_from_room:doors!rooms_door_id_fkey ( id, img_url, created_at, color_hex ),
      theme:themes ( id, theme_name, door_id, door:doors ( id, img_url, created_at, color_hex ) )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data as any[]).map((r) => {
    const effectiveDoor = r.door_from_room ?? r.theme?.door ?? undefined;
    return {
      id: r.id,
      room_name: r.room_name,
      theme_id: r.theme_id,
      created_at: r.created_at,
      user_id: r.user_id,
      door_id: r.door_id ?? null,
      door: effectiveDoor,
    } as Room;
  }) as Room[];
}

export async function createRoom(payload: {
  room_name: string;
  theme_id?: number | null;
  user_id: string;
  door_id: number | null;
}): Promise<Room> {
  const { data, error } = await supabase
    .from("rooms")
    .insert([payload])
    // Select minimal columns only to speed up insert response
    .select("id, room_name, theme_id, created_at, user_id, door_id")
    .single();

  if (error) throw error;

  console.log("createRoom raw:", data);

  // If a specific door was chosen (default theme), fetch its details once for immediate UI rendering
  let door: Door | undefined = undefined;
  if (data?.door_id) {
    const { data: doorRow, error: doorErr } = await supabase
      .from("doors")
      .select("id, img_url, created_at, color_hex")
      .eq("id", data.door_id)
      .single();
    if (!doorErr && doorRow) {
      door = doorRow as Door;
    }
  } else if (data?.theme_id) {
    // Otherwise, if theme has a predefined door, use it (e.g., Giáng sinh)
    const { data: themeWithDoor, error: themeErr } = await supabase
      .from("themes")
      .select(`door_id, door:doors ( id, img_url, created_at, color_hex )`)
      .eq("id", data.theme_id)
      .single();
    if (!themeErr && themeWithDoor?.door) {
      door = themeWithDoor.door as unknown as Door;
    }
  }

  return {
    ...(data as any),
    door,
  } as Room;
}

export async function deleteRoom(roomId: number): Promise<void> {
  const { error } = await supabase.from("rooms").delete().eq("id", roomId);
  if (error) throw error;
}
