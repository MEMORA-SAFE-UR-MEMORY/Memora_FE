import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface FloatPulseOptions {
  amplitude?: number; // độ cao dao động (px)
  duration?: number; // thời gian 1 nửa chu kỳ
  scaleTo?: number; // phóng to tối đa
  autoStart?: boolean;
  easing?: (value: number) => number;
}

export function useFloatPulse(options: FloatPulseOptions = {}) {
  const {
    amplitude = 10,
    duration = 1800,
    scaleTo = 1.05,
    autoStart = true,
    easing = Easing.inOut(Easing.quad),
  } = options;

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!autoStart) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration,
          easing,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [progress, duration, easing, autoStart]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -amplitude],
  });

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, scaleTo],
  });

  const animatedStyle = {
    transform: [{ translateY }, { scale }],
  };

  return { animatedStyle, progress };
}
