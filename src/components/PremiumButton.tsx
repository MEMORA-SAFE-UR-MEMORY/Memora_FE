import { useShimmerSweep } from "@src/hooks/transitions/useShimmerSweep";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Text,
  TouchableOpacity,
} from "react-native";

type PremiumButtonProps = {
  onPress?: () => void;
  label?: string;
};

export default function PremiumButton({
  onPress,
  label = "Premium",
}: PremiumButtonProps) {
  const [btnW, setBtnW] = useState(0);
  const [btnH, setBtnH] = useState(0);

  const fallbackW = 160;
  const width = btnW || fallbackW;
  const stripeWidth = Math.max(Math.floor(width * 0.35), 60);

  const { translateX } = useShimmerSweep({
    width,
    stripeWidth,
    duration: 1400,
    delay: 600,
  });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    if (w !== btnW) setBtnW(w);
    if (h !== btnH) setBtnH(h);
  };

  const borderRadius = 20;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{ borderRadius, overflow: "hidden", marginRight: 8 }}
      onLayout={onLayout}
    >
      {/* Nền gradient tĩnh của nút */}
      <LinearGradient
        colors={["#FF7C96", "#FF4268", "#FF5D02"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{ color: "#fff", fontFamily: "Baloo2_semiBold", fontSize: 14 }}
        >
          {label}
        </Text>
      </LinearGradient>

      {width > 0 && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -(btnH * 0.3 || 10),
            left: 0,
            width: stripeWidth,
            height: btnH * 1.6 || 60,
            transform: [{ translateX }, { rotate: "20deg" }],
            opacity: 0.9,
          }}
        >
          <LinearGradient
            colors={[
              "rgba(255,255,255,0)",
              "rgba(255,255,255,0.45)",
              "rgba(255,255,255,0)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}
