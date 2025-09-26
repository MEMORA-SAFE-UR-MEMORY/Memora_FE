import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { isTokenExpired, refreshAccessToken } from "@src/apis/authApi";

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        // Try to refresh the token
        const refreshToken = await AsyncStorage.getItem("refresh_token");
        if (refreshToken) {
          try {
            const data = await refreshAccessToken(refreshToken);
            if (data?.accessToken) {
              await AsyncStorage.setItem("auth_token", data.accessToken);
              if (data.refreshToken) {
                await AsyncStorage.setItem("refresh_token", data.refreshToken);
              }
              setIsAuthenticated(true);
              router.replace("/welcome");
              return;
            }
          } catch (error) {
            console.error("Error refreshing token:", error);
          }
        }
        // If refresh failed or no refresh token, logout
        await AsyncStorage.multiRemove(["auth_token", "refresh_token"]);
        setIsAuthenticated(false);
        router.replace("/");
      } else {
        setIsAuthenticated(true);
        router.replace("/welcome");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // Check token expiration every 4 minutes
    const interval = setInterval(checkAuth, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { loading, isAuthenticated, checkAuth };
};
