// src/hooks/useLogin.ts
import { useState } from "react";
import { loginUser, refreshAccessToken } from "@src/apis/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (userName: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(userName, password);

      // nếu backend trả token thì lưu lại
      if (data?.accessToken) {
        await AsyncStorage.setItem("auth_token", data.accessToken);
      }
      if (data?.refreshToken) {
        await AsyncStorage.setItem("refresh_token", data.refreshToken);
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Remove tokens from storage
      await AsyncStorage.multiRemove(["auth_token", "refresh_token"]);

      // Navigate back to login screen
      router.replace("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, handleLogout, loading, error };
};
