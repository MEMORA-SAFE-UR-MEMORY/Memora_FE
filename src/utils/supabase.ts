import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!url || !anon) {
  console.error(
    "Missing Supabase envs: EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_KEY"
  );
}

export const supabase = createClient(url!, anon!, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
