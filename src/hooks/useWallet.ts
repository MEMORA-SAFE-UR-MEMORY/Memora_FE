import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@src/utils/supabase";
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

      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", uid);
      if (error) throw error;
      setWallet(data[0]);
    } catch (err: any) {
      setError(err.message);
      setWallet(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const deductWallet = useCallback(
    async (amount: number) => {
      if (!wallet) return { success: false, message: "Wallet not found" };
      if (wallet.puzzles < amount) {
        return { success: false, message: "Not enough balance" };
      }
      try {
        const newBalance = wallet.puzzles - amount;
        const { error } = await supabase
          .from("wallets")
          .update({ puzzles: newBalance })
          .eq("id", wallet.id);
        if (error) throw error;
        setWallet({ ...wallet, puzzles: newBalance });
        return { success: true, message: "Deducted successfully" };
      } catch (err: any) {
        return { success: false, message: err.message };
      }
    },
    [wallet]
  );

  useEffect(() => {
    fetchAsync();
  }, [fetchAsync]);

  return { wallet, loading, error, deductWallet };
};
