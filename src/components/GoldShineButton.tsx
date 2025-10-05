import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  label: string;
  iconSource: ImageSourcePropType;
  onPress?: () => void;
  size?: number;
  borderColor?: string;
};

export default function GoldShineButton({
  label,
  iconSource,
  onPress,
  size = 41,
  borderColor = "#663530",
}: Props) {
  // Crossfade value between gradient sets
  const fade = useRef(new Animated.Value(0)).current;
  const [idx, setIdx] = useState(0);
  const pastelSets = React.useMemo(
    () =>
      [
        ["#FFD1DC", "#C7B9FF", "#B9F6CA"], // vivid pastel: pink - lavender - mint
        ["#FFE0B2", "#80DEEA", "#D1C4E9"], // peach - aqua - soft purple
        ["#BBDEFB", "#F8BBD0", "#C8E6C9"], // baby blue - light rose - pastel green
        ["#FFF59D", "#B39DDB", "#B2DFDB"], // pale yellow - lavender - teal mist (brighter)
      ] as readonly (readonly [string, string, string])[],
    []
  );
  const nextIdx = (idx + 1) % pastelSets.length;

  useEffect(() => {
    let mounted = true;
    const animate = () => {
      fade.setValue(0);
      Animated.timing(fade, {
        toValue: 1,
        duration: 3600,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!mounted) return;
        if (finished) setIdx((curr) => (curr + 1) % pastelSets.length);
      });
    };
    animate();
    const id = fade.addListener(({ value }) => {
      if (value === 1) {
        // restart next cycle
        animate();
      }
    });
    return () => {
      mounted = false;
      fade.removeListener(id);
    };
  }, [fade, pastelSets.length]);

  const circle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };

  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        style={{
          borderRadius: 50,
          marginBottom: -5,
          elevation: 4,
          overflow: "visible",
        }}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {/* Base gradient */}
        <View style={{ position: "relative" }}>
          <LinearGradient
            colors={pastelSets[idx]}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 0.9 }}
            style={[
              circle,
              {
                // subtle shadow to lift the circle
                shadowColor: "#663530",
                shadowOpacity: 0.25,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 3,
              },
            ]}
          />

          {/* Crossfade top gradient */}
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: fade,
            }}
            pointerEvents="none"
          >
            <LinearGradient
              colors={pastelSets[nextIdx]}
              start={{ x: 0.1, y: 0.1 }}
              end={{ x: 0.9, y: 0.9 }}
              style={circle}
            />
          </Animated.View>

          {/* Icon on top */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
            pointerEvents="none"
          >
            <Image
              source={iconSource}
              style={{ width: 26, height: 26 }}
              resizeMode="contain"
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* Label */}
      <Text
        style={{
          color: "#663530",
          fontSize: 14,
          fontFamily: "Baloo2_bold",
          textAlign: "center",
          textShadowColor: "#d0948dff",
          textShadowRadius: 1,
          elevation: 1,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 1,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
