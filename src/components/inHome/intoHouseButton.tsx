import { useFloatPulse } from "@src/hooks/transitions/useFloatPulseOptions";
import React, { memo, useMemo } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onPress: () => void;
  containerStyle?: ViewStyle;
  // neo vị trí theo mép màn hình (đã tính safe-area)
  anchor?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  offset?: { x?: number; y?: number };
};

const BORDER_COLOR = "#663530";

function IntoHouseButtonComp({
  onPress,
  containerStyle,
  anchor = "bottom-left",
  offset,
}: Props) {
  const insets = useSafeAreaInsets();
  const padX = offset?.x ?? 16;
  const padY = offset?.y ?? 16;

  const basePos = useMemo(() => {
    switch (anchor) {
      case "bottom-right":
        return { right: insets.right + padX, bottom: insets.bottom + padY };
      case "top-left":
        return { left: insets.left + padX, top: insets.top + padY };
      case "top-right":
        return { right: insets.right + padX, top: insets.top + padY };
      default:
        return { left: insets.left + padX, bottom: insets.bottom + padY };
    }
  }, [
    anchor,
    insets.bottom,
    insets.left,
    insets.right,
    insets.top,
    padX,
    padY,
  ]);

  const { animatedStyle } = useFloatPulse({
    amplitude: 10,
    duration: 1600,
    scaleTo: 1.07,
    useNativeDriver: true,
    isInteraction: false,
  });

  return (
    <Animated.View
      style={[
        { position: "absolute", zIndex: 20 },
        basePos,
        animatedStyle,
        containerStyle,
      ]}
      pointerEvents="box-none"
      renderToHardwareTextureAndroid
      shouldRasterizeIOS
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={styles.btn}
      >
        <Image
          source={require("../../../assets/icons/Door.png")}
          style={{ width: 28, height: 28 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "white",
    width: 48,
    height: 48,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BORDER_COLOR,
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    position: "relative",
  },
});

const IntoHouseButton = memo(IntoHouseButtonComp);
export default IntoHouseButton;
