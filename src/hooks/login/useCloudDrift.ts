// src/hooks/useCloudDrift.ts
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

type DriftOpts = {
  containerWidth: number; // bề rộng vùng bay (thường là chiều rộng màn hình)
  elementWidth: number; // bề rộng đám mây (đo từ onLayout của chính nó)
  direction?: "ltr" | "rtl"; // trái->phải hay phải->trái
  duration?: number; // thời gian bay hết 1 vòng (ms)
  gap?: number; // khoảng “ngoài khung” trước khi re-enter
  repeatDelay?: number; // nghỉ giữa các vòng
  initialDelay?: number; // delay cho vòng đầu (để so-le nhiều mây)
  bobbingAmplitude?: number; // biên độ nhấp nhô dọc (px)
  bobbingPeriod?: number; // chu kỳ nhấp nhô (ms)
};

export function useCloudDrift({
  containerWidth,
  elementWidth,
  direction = "rtl",
  duration = 22000,
  gap = 24,
  repeatDelay = 0,
  initialDelay = 0,
  bobbingAmplitude = 4,
  bobbingPeriod = 3800,
}: DriftOpts) {
  const p = useRef(new Animated.Value(0)).current; // tiến trình 0→1 (ngang)
  const bob = useRef(new Animated.Value(0)).current; // tiến trình 0↔1 (dọc)

  // ---- loop ngang ----
  useEffect(() => {
    let mounted = true;
    const run = () => {
      if (!mounted) return;
      p.setValue(0);
      Animated.sequence([
        Animated.delay(initialDelay),
        Animated.timing(p, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(repeatDelay),
      ]).start(({ finished }) => finished && mounted && run());
    };
    run();
    return () => {
      mounted = false;
      p.stopAnimation();
    };
  }, [p, duration, repeatDelay, initialDelay]);

  // ---- nhấp nhô dọc (dịch lên/xuống mượt) ----
  useEffect(() => {
    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: bobbingPeriod / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: bobbingPeriod / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    bobLoop.start();
    return () => bobLoop.stop();
  }, [bob, bobbingPeriod]);

  // Tính điểm đầu/cuối theo hướng
  const startX =
    direction === "rtl" ? containerWidth + gap : -elementWidth - gap;

  const endX = direction === "rtl" ? -elementWidth - gap : containerWidth + gap;

  const translateX = p.interpolate({
    inputRange: [0, 1],
    outputRange: [startX, endX],
  });

  const translateY = bob.interpolate({
    inputRange: [0, 1],
    outputRange: [-bobbingAmplitude, bobbingAmplitude],
  });

  return { translateX, translateY };
}
