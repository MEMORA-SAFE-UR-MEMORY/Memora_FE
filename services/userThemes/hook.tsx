import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { fetchUserThemesByUser } from "./api";
import { UserThemeRow } from "./type";

export function useUserThemes() {
  const [items, setItems] = useState<UserThemeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const resolveUserId = useCallback(async (): Promise<string | null> => {
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
    const data = await fetchUserThemesByUser(uid);
    try {
      // console.log();
    } catch {}
    setItems(data);
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
        if (mounted) {
          try {
            console.log("[useUserThemes] error:", e);
          } catch {}
          setError(e);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [reload, resolveUserId]);

  return {
    items,
    loading,
    error,
    userId,
    refresh: () => userId && reload(userId),
  };
}
