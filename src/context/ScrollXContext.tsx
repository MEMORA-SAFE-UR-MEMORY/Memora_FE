import { createContext, useContext } from "react";
import { Animated } from "react-native";

type ScrollCtx = {
  scrollX: Animated.Value;
  setContentWidth: (w: number) => void;
  setHallReady: (ready: boolean) => void;
};

export const ScrollXContext = createContext<ScrollCtx | null>(null);

export function useScrollX() {
  const ctx = useContext(ScrollXContext);
  if (!ctx) throw new Error("useScrollX must be used within provider");
  return ctx;
}
