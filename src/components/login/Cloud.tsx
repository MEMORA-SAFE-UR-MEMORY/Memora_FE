// src/components/Cloud.tsx
import { useCloudDrift } from "@src/hooks/login/useCloudDrift";
import React, { useState } from "react";
import {
  Animated,
  ImageSourcePropType,
  LayoutChangeEvent,
  useWindowDimensions,
} from "react-native";

type CloudProps = {
  source: ImageSourcePropType;
  top: number; // vị trí theo trục Y (px)
  height?: number; // chiều cao cloud (nên set để scale ổn định)
  direction?: "ltr" | "rtl";
  duration?: number;
  initialDelay?: number;
  repeatDelay?: number;
  bobbingAmplitude?: number;
  bobbingPeriod?: number;
  zIndex?: number;
};

export default function Cloud({
  source,
  top,
  height = 140,
  direction = "rtl",
  duration = 22000,
  initialDelay = 0,
  repeatDelay = 0,
  bobbingAmplitude = 4,
  bobbingPeriod = 3800,
  zIndex = 0,
}: CloudProps) {
  const { width: screenW } = useWindowDimensions();
  const [cloudW, setCloudW] = useState(0);

  const { translateX, translateY } = useCloudDrift({
    containerWidth: screenW,
    elementWidth: cloudW || 200,
    direction,
    duration,
    initialDelay,
    repeatDelay,
    bobbingAmplitude,
    bobbingPeriod,
    gap: 24,
  });

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w && w !== cloudW) setCloudW(w);
  };

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top,
        height,
        transform: [{ translateX }, { translateY }],
        zIndex,
      }}
    >
      <Animated.Image
        source={source}
        resizeMode="contain"
        onLayout={onLayout}
        style={{ height }}
      />
    </Animated.View>
  );
}
