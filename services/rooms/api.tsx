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
      id, room_name, theme_id, created_at, user_id, door_id, type,
      door_from_room:doors!rooms_door_id_fkey ( id, img_url, created_at, color_hex ),
      user_theme:user_themes!rooms_theme_id_fkey (
        id, theme_id,
        theme:themes (
          id, theme_name, door_id,
          door:doors ( id, img_url, created_at, color_hex )
        )
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data as any[]).map((r) => {
    const effectiveDoor =
      r.door_from_room ?? r.user_theme?.theme?.door ?? undefined;
    return {
      id: r.id,
      room_name: r.room_name,
      theme_id: r.user_theme?.theme_id ?? null,
      user_theme_id: r.theme_id ?? null,
      created_at: r.created_at,
      user_id: r.user_id,
      door_id: r.door_id ?? null,
      door: effectiveDoor,
      type: r.type ?? undefined,
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
    .select("id, room_name, theme_id, created_at, user_id, door_id, type")
    .single();

  if (error) throw error;

  console.log("createRoom raw:", data);

  let door: Door | undefined = undefined;
  let actualThemeId: number | null = null;
  if (data?.door_id) {
    const { data: doorRow, error: doorErr } = await supabase
      .from("doors")
      .select("id, img_url, created_at, color_hex")
      .eq("id", data.door_id)
      .single();
    if (!doorErr && doorRow) {
      door = doorRow as Door;
    }
  }

  if (data?.theme_id) {
    const { data: utRow, error: utErr } = await supabase
      .from("user_themes")
      .select(
        `theme_id, theme:themes ( door_id, door:doors ( id, img_url, created_at, color_hex ) )`
      )
      .eq("id", data.theme_id)
      .single();
    const ut: any = utRow as any;
    if (!utErr) {
      actualThemeId = ut?.theme_id ?? null;

      if (!door && ut?.theme?.door) {
        door = ut.theme.door as Door;
      }
    }
  }

  return {
    ...(data as any),
    theme_id: actualThemeId ?? null,
    user_theme_id: data?.theme_id ?? null,
    door,
    type: data?.type ?? "private",
  } as Room;
}

export async function deleteRoom(roomId: number): Promise<void> {
  const { error } = await supabase.from("rooms").delete().eq("id", roomId);
  if (error) throw error;
}

export async function fetchRandomPublicRoom(
  excludeUserId?: string | null,
  excludeRoomId?: number | null
): Promise<{
  roomId: number;
  themeId: number;
  type: string;
} | null> {
  let countQuery = supabase
    .from("rooms")
    .select("id", { count: "exact", head: true })
    .eq("type", "public");
  if (excludeUserId) {
    countQuery = countQuery.neq("user_id", excludeUserId);
  }
  if (excludeRoomId != null) {
    countQuery = countQuery.neq("id", excludeRoomId);
  }
  let countRes = await countQuery;
  if (countRes.error) throw countRes.error;

  let total = countRes.count ?? 0;

  let useExcludeRoom = excludeRoomId != null;
  if (total <= 0 && excludeRoomId != null) {
    let fallbackCount = supabase
      .from("rooms")
      .select("id", { count: "exact", head: true })
      .eq("type", "public");
    if (excludeUserId)
      fallbackCount = fallbackCount.neq("user_id", excludeUserId);
    const fallbackRes = await fallbackCount;
    if (fallbackRes.error) throw fallbackRes.error;
    total = fallbackRes.count ?? 0;
    useExcludeRoom = false;
  }

  if (total <= 0) return null;

  const offset = Math.floor(Math.random() * total);

  let dataQuery = supabase
    .from("rooms")
    .select(
      `
      id, theme_id, type,
      user_theme:user_themes!rooms_theme_id_fkey (
        theme_id
      )
    `
    )
    .eq("type", "public");

  if (excludeUserId) {
    dataQuery = dataQuery.neq("user_id", excludeUserId);
  }
  if (useExcludeRoom && excludeRoomId != null) {
    dataQuery = dataQuery.neq("id", excludeRoomId);
  }

  const { data, error } = await dataQuery
    .order("id", { ascending: true })
    .range(offset, offset);

  if (error) throw error;

  const r = (data ?? [])[0] as any;
  if (!r) return null;

  const actualThemeId = r?.user_theme?.theme_id ?? null;
  if (actualThemeId == null) return null;

  return {
    roomId: r.id as number,
    themeId: actualThemeId as number,
    type: r.type ?? "public",
  };
}
