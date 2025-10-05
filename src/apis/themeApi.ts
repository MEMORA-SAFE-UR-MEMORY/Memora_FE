import { supabase } from "@src/lib/supabase";
import { Theme } from "@src/types/theme";

export async function fetchAllThemes(): Promise<Theme[]> {
  const { data, error } = await supabase
    .from("themes")
    .select("id, theme_name, theme_price, wall_url, floor_url");

  if (error) throw error;
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    themeName: row.theme_name,
    themePrice: row.theme_price,
    wallUrl: row.wall_url,
    floorUrl: row.floor_url,
    createdAt: new Date().toISOString(),
  })) as Theme[];
}
