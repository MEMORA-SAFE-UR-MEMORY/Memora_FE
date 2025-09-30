import { createClient } from "@supabase/supabase-js";
import { Theme, UserThemeRow } from "./type";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY!;
if (!SUPABASE_URL) throw new Error("Missing env SUPABASE_URL");
if (!SUPABASE_KEY) throw new Error("Missing env SUPABASE_KEY");

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function fetchUserThemesByUser(
  userId: string
): Promise<UserThemeRow[]> {
  const { data, error } = await supabase
    .from("user_themes")
    .select(
      `
      id, created_at, theme_id, user_id,
      theme:themes (
        id, theme_name, theme_price, created_at, wall_url, floor_url, door_id, revenue_cat_product_id
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as any[];
  return rows.map((r) => ({
    id: r.id,
    created_at: r.created_at,
    theme_id: r.theme_id,
    user_id: r.user_id,
    theme: r.theme
      ? ({
          id: r.theme.id,
          theme_name: r.theme.theme_name,
          theme_price: Number(r.theme.theme_price ?? 0),
          created_at: r.theme.created_at,
          wall_url: r.theme.wall_url,
          floor_url: r.theme.floor_url,
          door_id: r.theme.door_id ?? null,
          revenue_cat_product_id: r.theme.revenue_cat_product_id ?? null,
        } as Theme)
      : null,
  })) as UserThemeRow[];
}
