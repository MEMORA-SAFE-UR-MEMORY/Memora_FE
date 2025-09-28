import { createClient } from "@supabase/supabase-js";
import { WalletRow } from "./type";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY!;
if (!SUPABASE_URL) throw new Error("Missing env SUPABASE_URL");
if (!SUPABASE_KEY) throw new Error("Missing env SUPABASE_KEY");

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const toNum = (v: any): number =>
  v == null ? 0 : typeof v === "number" ? v : Number(v);

export async function getWalletByUser(
  userId: string
): Promise<WalletRow | null> {
  const { data, error } = await supabase
    .from("wallets")
    .select("id,puzzles,created_at,updated_at,user_id,last_daily_claim_at")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return { ...data, puzzles: toNum(data.puzzles) } as WalletRow;
}

export async function updateWalletByUser(
  userId: string,
  patch: Partial<Pick<WalletRow, "puzzles" | "last_daily_claim_at">>
): Promise<WalletRow> {
  const { data, error } = await supabase
    .from("wallets")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select("id,puzzles,created_at,updated_at,user_id,last_daily_claim_at")
    .single();

  if (error) throw error;
  return { ...data, puzzles: toNum(data.puzzles) } as WalletRow;
}

export async function claimDailyReward(
  userId: string,
  reward = 100
): Promise<WalletRow> {
  const now = new Date();
  const wallet = await getWalletByUser(userId);
  if (!wallet) throw new Error("Wallet not found");

  const last = wallet.last_daily_claim_at
    ? new Date(wallet.last_daily_claim_at)
    : null;
  const ms24h = 24 * 60 * 60 * 1000;

  if (last && now.getTime() - last.getTime() < ms24h) {
    throw new Error("Daily reward not available yet");
  }

  const next = (wallet.puzzles ?? 0) + reward;
  const updated = await updateWalletByUser(userId, {
    puzzles: next,
    last_daily_claim_at: now.toISOString(),
  });

  return updated;
}
