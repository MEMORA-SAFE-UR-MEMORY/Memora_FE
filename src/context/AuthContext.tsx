// src/context/AuthContext.tsx
import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "@src/apis/authApi";

interface AuthContextType {
  user: any;
  accessToken: string | null;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const decodeToken = (token: string) => {
    try {
      return jwtDecode<any>(token);
    } catch {
      return null;
    }
  };

  const checkAndRefreshToken = async () => {
    const storedToken = await AsyncStorage.getItem("auth_token");
    const refreshToken = await AsyncStorage.getItem("refresh_token");
    const storedUser = await AsyncStorage.getItem("user");

    // Nếu có user trong storage thì set luôn
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        setUser(null);
      }
    }

    // Nếu chưa có token hoặc refreshToken thì thoát
    if (!storedToken || !refreshToken) return;

    // Nếu chưa có user (hoặc user lỗi) => thử refresh
    if (!storedUser || storedUser === "undefined") {
      try {
        const newData = await refreshAccessToken(refreshToken);
        if (newData?.accessToken) {
          await AsyncStorage.setItem("auth_token", newData.accessToken);
          setAccessToken(newData.accessToken);

          const newUser = decodeToken(newData.accessToken);
          if (newUser) {
            setUser(newUser);
            await AsyncStorage.setItem("user", JSON.stringify(newUser));
          }
        }
      } catch (err) {
        console.log("Refresh token failed:", err);
        await logout();
      }
      return;
    }

    // Nếu có user thì kiểm tra hạn token
    const decoded = decodeToken(storedToken);
    if (!decoded) return;

    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      // Token hết hạn => refresh
      try {
        const newData = await refreshAccessToken(refreshToken);
        if (newData?.accessToken) {
          await AsyncStorage.setItem("auth_token", newData.accessToken);
          setAccessToken(newData.accessToken);

          const newUser = decodeToken(newData.accessToken);
          if (newUser) {
            setUser(newUser);
            await AsyncStorage.setItem("user", JSON.stringify(newUser));
          }
        }
      } catch (err) {
        console.log("Refresh token failed:", err);
        await logout();
      }
    } else {
      setAccessToken(storedToken);
      setUser(decoded);
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["auth_token", "refresh_token", "user"]);
    setUser(null);
    setAccessToken(null);
  };

  useEffect(() => {
    checkAndRefreshToken();

    // Check mỗi 1 phút
    const interval = setInterval(checkAndRefreshToken, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
