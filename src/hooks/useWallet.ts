import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@src/lib/supabase";
import { useCallback, useEffect, useState } from "react";

export const useWallet = () => {
  const [wallet, setWallet] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchAsync = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      const uid = user.id;
      console.log("typeof uid:", typeof uid, "uid:", uid);

      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", uid);
      console.log("data", data);
      if (error) throw error;
      setWallet(data);
    } catch (err: any) {
      setError(err.message);
      setWallet(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAsync();
  }, [fetchAsync]);

  return { wallet, loading, error };
};
