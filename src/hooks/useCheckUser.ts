import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";

export const useCheckUser = (getUserById) => {
  const isNavigating = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const checkUserData = useCallback(async () => {
    if (isNavigating.current || !mounted.current) {
      console.log("[CheckUser] Already navigating or unmounted");
      return;
    }

    try {
      isNavigating.current = true;
      console.log("[CheckUser] Starting user check...");

      // Kiểm tra user data
      const userData = await AsyncStorage.getItem("user");
      console.log("[CheckUser] User data:", userData);

      if (!userData || !mounted.current) {
        console.log("[CheckUser] No user data or component unmounted");
        router.replace("/");
        return;
      }

      const parsedUser = JSON.parse(userData);
      if (!parsedUser?.id) {
        console.log("[CheckUser] Invalid user data structure");
        router.replace("/");
        return;
      }

      // Thêm delay để đảm bảo AsyncStorage đã sẵn sàng
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (!mounted.current) return;

      const supabaseUser = await getUserById(parsedUser.id);
      console.log("[CheckUser] Supabase user:", supabaseUser);

      if (!supabaseUser || !mounted.current) {
        console.log("[CheckUser] No supabase user or component unmounted");
        router.replace("/");
        return;
      }

      const emailUsername = supabaseUser.email.split("@")[0];
      const userUsername = supabaseUser.username.split("@")[0];

      if (!mounted.current) return;

      if (userUsername === emailUsername) {
        router.replace("/username");
      } else {
        router.replace("/home");
      }
    } catch (error) {
      console.error("[CheckUser] Error:", error);
      if (mounted.current) {
        router.replace("/");
      }
    } finally {
      if (mounted.current) {
        isNavigating.current = false;
      }
    }
  }, [getUserById]);

  return checkUserData;
};
