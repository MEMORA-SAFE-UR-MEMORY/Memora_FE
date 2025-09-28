import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface FloatPulseOptions {
  amplitude?: number;
  duration?: number;
  scaleTo?: number;
  useNativeDriver?: boolean;
  isInteraction?: boolean;
  easing?: (value: number) => number;
  autoStart?: boolean;
}

export function useFloatPulse(options: FloatPulseOptions = {}) {
  const {
    amplitude = 10,
    duration = 1800,
    scaleTo = 1.05,
    useNativeDriver = true,
    isInteraction = false,
    easing = Easing.inOut(Easing.ease),
    autoStart = true,
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
          useNativeDriver,
          isInteraction,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration,
          easing,
          useNativeDriver,
          isInteraction,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [progress, duration, easing, autoStart, useNativeDriver, isInteraction]);

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
