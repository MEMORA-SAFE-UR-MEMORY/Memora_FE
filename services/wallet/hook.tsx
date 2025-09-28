// services/wallets/hook.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { claimDailyReward, getWalletByUser } from "./api";
import { walletBus } from "./bus";
import { WalletRow } from "./type";

export function useWalletGet() {
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
      } catch {
        // ignore parse error
      }
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

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = walletBus.on("updated", () => {
      reload(userId);
    });

    return () => {
      unsubscribe();
    };
  }, [userId, reload]);

  return {
    wallet,
    loading,
    error,
    userId,
    refresh: () => userId && reload(userId),
  };
}

const MS_24H = 24 * 60 * 60 * 1000;

export function useDailyReward() {
  const [userId, setUserId] = useState<string | null>(null);
  const [wallet, setWallet] = useState<WalletRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [now, setNow] = useState<number>(Date.now());

  // tick mỗi 1s để đếm ngược (nếu cần)
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const resolveUserId = useCallback(async () => {
    let uid: string | null = null;
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        uid = u?.id ?? u?.user_id ?? null;
      } catch {}
    }
    if (!uid) uid = (await AsyncStorage.getItem("userId")) ?? null;
    return uid;
  }, []);

  const reload = useCallback(async (uid: string) => {
    const w = await getWalletByUser(uid);
    setWallet(w);
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

  const last = useMemo(
    () =>
      wallet?.last_daily_claim_at
        ? new Date(wallet.last_daily_claim_at).getTime()
        : null,
    [wallet]
  );
  const elapsed = useMemo(() => (last ? now - last : MS_24H + 1), [last, now]);
  const canClaim = elapsed >= MS_24H;

  const timeLeftMs = Math.max(0, MS_24H - elapsed);
  const timeLeft = useMemo(() => {
    const s = Math.ceil(timeLeftMs / 1000);
    const hh = Math.floor(s / 3600)
      .toString()
      .padStart(2, "0");
    const mm = Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const ss = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }, [timeLeftMs]);

  const claim = useCallback(
    async (reward = 100) => {
      if (!userId) throw new Error("Missing user id");
      if (!canClaim) throw new Error("Daily reward not available yet");

      setClaiming(true);
      try {
        const updated = await claimDailyReward(userId, reward);
        setWallet(updated);
        walletBus.emit("updated");
      } finally {
        setClaiming(false);
      }
    },
    [userId, canClaim]
  );

  return {
    wallet,
    loading,
    error,
    canClaim,
    timeLeft,
    claim,
    claiming,
    refresh: () => userId && reload(userId!),
  };
}
