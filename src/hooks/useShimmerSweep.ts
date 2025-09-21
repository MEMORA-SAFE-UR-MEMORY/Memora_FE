import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

type Options = {
  width: number;
  stripeWidth?: number;
  duration?: number;
  delay?: number;
};

export function useShimmerSweep({
  width,
  stripeWidth = 80,
  duration = 1600,
  delay = 700,
}: Options) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    const loop = () => {
      if (!mounted) return;
      progress.setValue(0);
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => loop());
    };
    loop();
    return () => {
      mounted = false;
      progress.stopAnimation();
    };
  }, [progress, width, duration, delay]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-stripeWidth, width + stripeWidth],
  });

  return { translateX };
}
