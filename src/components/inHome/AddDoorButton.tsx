import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

type Props = {
  onPress: () => void;
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
  dash?: number;
  gap?: number;
  speedMs?: number;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function AddDoorButton({
  onPress,
  size = 80,
  strokeColor = "#A8A8A8",
  strokeWidth = 2,
  dash = 10,
  gap = 6,
  speedMs = 9000,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const dashOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(dashOffset, {
        toValue: circumference,
        duration: speedMs,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [dashOffset, circumference, speedMs]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        top: -100,
      }}
    >
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash},${gap}`}
            strokeLinecap="round"
            strokeDashoffset={dashOffset as unknown as number}
          />
        </Svg>
      </View>

      <Text
        style={{
          fontSize: size * 0.25,
          lineHeight: size * 0.28,
          fontWeight: "400",
          color: "#555",
        }}
      >
        +
      </Text>
    </TouchableOpacity>
  );
}
