export type WalletRow = {
  id: string;
  puzzles: number;
  created_at: string;
  updated_at?: string | null;
  user_id: string;
  last_daily_claim_at?: string | null;
};
