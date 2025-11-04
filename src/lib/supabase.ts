import { createClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!url || !anon) {
  console.error("Missing Supabase envs");
}

export const supabase = createClient(url!, anon!);
