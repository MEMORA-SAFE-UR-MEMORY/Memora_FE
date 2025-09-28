// src/hooks/useLogin.ts
import { useState } from "react";
import { loginUser, refreshAccessToken } from "@src/apis/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";

// Định nghĩa interface cho user payload từ JWT
interface User {
  aud: string;
  exp: number;
  id: string;
  iss: string;
  nbf: number;
  role: string;
  token_type: string;
  username: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const decodeToken = (token: string): User | null => {
    try {
      const decoded = jwtDecode<User>(token);
      console.log("Decoded token:", decoded);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleLogin = async (userName: string, password: string) => {
    setLoading(true);
    try {
      const data = await loginUser(userName, password);

      if (data?.accessToken) {
        await AsyncStorage.setItem("auth_token", data.accessToken);

        // Decode và lưu thông tin user
        const decodedUser = decodeToken(data.accessToken);
        if (decodedUser) {
          console.log(decodedUser);
          setUser(decodedUser);
          await AsyncStorage.setItem("user", JSON.stringify(decodedUser));
        }

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
      await AsyncStorage.multiRemove(["auth_token", "refresh_token", "user"]);
      setUser(null);
      // Add delay before navigation
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.replace("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { handleLogin, handleLogout, loading, error, user };
};
