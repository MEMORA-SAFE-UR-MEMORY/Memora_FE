import { createClient } from "@supabase/supabase-js";
import { WalletRow } from "./type";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY!;
if (!SUPABASE_URL) throw new Error("Missing env SUPABASE_URL");
if (!SUPABASE_KEY) throw new Error("Missing env SUPABASE_KEY");

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const toNum = (v: any): number =>
  v == null ? 0 : typeof v === "number" ? v : Number(v);

export async function getWalletByUser(userId: string): Promise<WalletRow | null> {
  const { data, error } = await supabase
    .from("wallets")
    .select("id,puzzles,created_at,updated_at,user_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return { ...data, puzzles: toNum(data.puzzles) } as WalletRow;
}

export async function updateWalletByUser(
  userId: string,
  patch: Partial<Pick<WalletRow, "puzzles">>
): Promise<WalletRow> {
  const { data, error } = await supabase
    .from("wallets")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select("id,puzzles,created_at,updated_at,user_id")
    .single();

  if (error) throw error;
  return { ...data, puzzles: toNum(data.puzzles) } as WalletRow;
}
