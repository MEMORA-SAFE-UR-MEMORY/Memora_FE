/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { router } from "expo-router";
import React, { useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onFinish?: () => void;
};

export default function EnterHouseTransition({ visible, onFinish }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      // Run animations in parallel
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 8, // zoom cực đại
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(flashOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(flashOpacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onFinish?.();
        router.replace("/hall");
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Zoom view */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "#fff",
            transform: [{ scale }],
            opacity: 0.9,
          },
        ]}
      />

      {/* Flash overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "#fff", opacity: flashOpacity },
        ]}
      />
    </View>
  );
}
