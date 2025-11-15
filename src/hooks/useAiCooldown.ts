import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export const useAiCooldown = (cooldownSeconds: number = 300) => {
  const STORAGE_KEY = "AI_COOLDOWN_END";

  const [aiDisabled, setAiDisabled] = useState(false);
  const [aiCountdown, setAiCountdown] = useState(0);

  // ----------------------------------------
  // 1. Kích hoạt cooldown (gọi khi API lỗi)
  // ----------------------------------------
  const startCooldown = useCallback(async () => {
    const endTime = Date.now() + cooldownSeconds * 1000;
    await AsyncStorage.setItem(STORAGE_KEY, endTime.toString());

    setAiDisabled(true);
    setAiCountdown(cooldownSeconds);
  }, [cooldownSeconds]);

  // ----------------------------------------
  // 2. Khi component mount → kiểm tra cooldown đã lưu
  // ----------------------------------------
  useEffect(() => {
    const checkCooldown = async () => {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (!value) return;

      const endTime = parseInt(value, 10);
      const now = Date.now();

      if (endTime > now) {
        const remaining = Math.floor((endTime - now) / 1000);
        setAiDisabled(true);
        setAiCountdown(remaining);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    };

    checkCooldown();
  }, []);

  // ----------------------------------------
  // 3. Timer đếm ngược chạy ngầm
  // ----------------------------------------
  useEffect(() => {
    if (!aiDisabled) return;

    const interval = setInterval(() => {
      setAiCountdown((prev) => {
        if (prev <= 1) {
          setAiDisabled(false);
          AsyncStorage.removeItem(STORAGE_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [aiDisabled]);

  return {
    aiDisabled,
    aiCountdown,
    startCooldown,
  };
};
