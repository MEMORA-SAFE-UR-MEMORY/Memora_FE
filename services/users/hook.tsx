import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import { deleteUserHard } from "./api";

export function useDeleteAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const getUserId = useCallback(async (): Promise<string | null> => {
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

  const deleteAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const uid = await getUserId();
      if (!uid) throw new Error("Missing user id");
      await deleteUserHard(uid);

      await AsyncStorage.multiRemove([
        "user",
        "userId",
        "accessToken",
        "refreshToken",
      ]);
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  return { deleteAccount, loading, error };
}
