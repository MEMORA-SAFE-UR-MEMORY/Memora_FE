import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface UseShakeOptions {
  angle?: number; // độ lệch tối đa (degree)
  translate?: number; // px dịch ngang tối đa
  duration?: number; // thời gian 1 nửa nhịp (ms)
  autoStart?: boolean;
  easing?: (value: number) => number;
}

export function useShake({
  angle = 8,
  translate = 2,
  duration = 160,
  autoStart = true,
  easing = Easing.inOut(Easing.quad),
}: UseShakeOptions = {}) {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!autoStart) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, {
          toValue: 1,
          duration,
          easing,
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: -1,
          duration: duration * 2,
          easing,
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration,
          easing,
          useNativeDriver: true,
        }),
        Animated.delay(600), // nghỉ nhẹ
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v, duration, easing, autoStart]);

  const rotate = v.interpolate({
    inputRange: [-1, 1],
    outputRange: [`-${angle}deg`, `${angle}deg`],
  });

  const translateX = v.interpolate({
    inputRange: [-1, 1],
    outputRange: [-translate, translate],
  });

  return {
    animatedStyle: {
      transform: [{ rotate }, { translateX }],
    },
    value: v,
  };
}
