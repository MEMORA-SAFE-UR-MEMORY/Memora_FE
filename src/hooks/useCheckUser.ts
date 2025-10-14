import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCallback, useRef } from "react";

export const useCheckUser = (getUserById) => {
  const isNavigating = useRef(false);

  const checkUserData = useCallback(async () => {
    if (isNavigating.current) {
      console.log("[CheckUser] Already navigating, skipping...");
      return;
    }

    try {
      isNavigating.current = true;
      console.log("[CheckUser] Starting user check...");

      // Thêm delay trước khi check
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData = await AsyncStorage.getItem("user");
      console.log("[CheckUser] User data:", userData);

      if (!userData) {
        console.log("[CheckUser] No user data found");
        router.replace("/");
        return;
      }

      const parsedUser = JSON.parse(userData);
      const supabaseUser = await getUserById(parsedUser.id);
      console.log("[CheckUser] Supabase user:", supabaseUser);

      if (!supabaseUser) {
        console.log("[CheckUser] No supabase user found");
        router.replace("/");
        return;
      }

      const emailUsername = supabaseUser.email.split("@")[0];
      const userUsername = supabaseUser.username.split("@")[0];

      // Thêm delay trước khi navigate
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (userUsername === emailUsername) {
        router.replace("/username");
      } else {
        router.replace("/home");
      }
    } catch (error) {
      console.error("[CheckUser] Error:", error);
      router.replace("/");
    } finally {
      isNavigating.current = false;
    }
  }, [getUserById]);

  return checkUserData;
};
