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
    try {
      const data = await loginUser(userName, password);

      if (data?.accessToken) {
        await AsyncStorage.setItem("auth_token", data.accessToken);
        if (data?.refreshToken) {
          await AsyncStorage.setItem("refresh_token", data.refreshToken);
        }
        // Add delay before navigation
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.replace("/welcome");
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
    try {
      await AsyncStorage.multiRemove(["auth_token", "refresh_token"]);
      // Add delay before navigation
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.replace("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { handleLogin, handleLogout, loading, error };
};
