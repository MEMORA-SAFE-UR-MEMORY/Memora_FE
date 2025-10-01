import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import { deleteUserHard } from "./api"; // giữ nguyên import bạn đang dùng

export function useDeleteAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const getUserId = useCallback(async (): Promise<string | null> => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const fromUser =
          user?.id ??
          user?.userId ??
          user?.uid ??
          user?.user?.id ??
          user?.user?.userId ??
          null;
        if (fromUser) return String(fromUser);
      }
    } catch {}
    const uid = await AsyncStorage.getItem("userId");
    return uid ?? null;
  }, []);

  const deleteAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const uid = await getUserId();

      if (uid) {
        await deleteUserHard(uid);
      } else {
        console.warn("No UID in storage, skip server delete");
      }
    } catch (e) {
      setError(e);
      console.log("Delete account (server) failed:", e);
    } finally {
      await AsyncStorage.multiRemove([
        "user",
        "userId",
        "accessToken",
        "refreshToken",
        "auth_token",
        "refresh_token",
      ]);
      setLoading(false);
    }
  }, [getUserId]);

  return { deleteAccount, loading, error };
}
