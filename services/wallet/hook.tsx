import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { getWalletByUser, updateWalletByUser } from "./api";
import { WalletRow } from "./type";

export function useWalletGetAndUpdate() {
  const [wallet, setWallet] = useState<WalletRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const resolveUserId = useCallback(async (): Promise<string | null> => {
    let uid: string | null = null;
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        uid = user?.id ?? user?.user_id ?? null;
      } catch {}
    }
    if (!uid) uid = (await AsyncStorage.getItem("userId")) ?? null;
    return uid;
  }, []);

  const reload = useCallback(async (uid: string) => {
    const data = await getWalletByUser(uid);
    setWallet(data);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const uid = await resolveUserId();
        if (!mounted) return;
        setUserId(uid);
        if (uid) await reload(uid);
      } catch (e) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [reload, resolveUserId]);

  const updatePuzzles = useCallback(
    async (value: number) => {
      if (!userId) throw new Error("Missing user id");
      const updated = await updateWalletByUser(userId, { puzzles: value });
      setWallet(updated);
      return updated;
    },
    [userId]
  );

  return {
    wallet,
    loading,
    error,
    refresh: () => userId && reload(userId),
    updatePuzzles,
  };
}
