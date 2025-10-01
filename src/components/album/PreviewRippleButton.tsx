import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, ViewStyle } from "react-native";

type Props = {
  onPress: () => void;
  size?: number; // đường kính nút
  color?: string; // màu ripple
  iconColor?: string; // màu icon
  style?: ViewStyle; // vị trí (absolute) truyền từ ngoài
};

export default function PreviewRippleButton({
  onPress,
  size = 36,
  color = "#ec4899",
  iconColor = "#fff",
  style,
}: Props) {
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const mkLoop = (v: Animated.Value, delayMs: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delayMs),
          Animated.timing(v, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    const l1 = mkLoop(ripple1, 0);
    const l2 = mkLoop(ripple2, 900);
    l1.start();
    l2.start();
    return () => {
      l1.stop();
      l2.stop();
    };
  }, [ripple1, ripple2]);

  return (
    <Animated.View
      style={[styles.wrap, { width: size, height: size }, style]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[
          styles.ripple,
          {
            backgroundColor: color,
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [
              {
                scale: ripple1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2.6],
                }),
              },
            ],
            opacity: ripple1.interpolate({
              inputRange: [0, 1],
              outputRange: [0.45, 0],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ripple,
          {
            backgroundColor: color,
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [
              {
                scale: ripple2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2.6],
                }),
              },
            ],
            opacity: ripple2.interpolate({
              inputRange: [0, 1],
              outputRange: [0.45, 0],
            }),
          },
        ]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Xem bản thử"
        onPress={onPress}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
        }}
      >
        <Ionicons
          name="eye-outline"
          size={Math.round(size * 0.45)}
          color={iconColor}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ripple: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});
