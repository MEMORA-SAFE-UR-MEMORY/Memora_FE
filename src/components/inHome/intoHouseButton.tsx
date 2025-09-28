import { useFloatPulse } from "@src/hooks/transitions/useFloatPulseOptions";
import React, { memo } from "react";
import {
  Animated,
  Image,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  onPress: () => void;
  containerStyle?: ViewStyle;
};

const TRI_OUTER = 10;
const TRI_INNER = 8;
const TRI_OUTER_RIGHT = 14;
const TRI_INNER_RIGHT = 12;
const TRI_GAP = 2;
const BORDER_WIDTH = 2;

function IntoHouseButtonComp({ onPress, containerStyle }: Props) {
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
        style={{
          backgroundColor: "white",
          width: 48,
          height: 48,
          borderRadius: 27,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#663530",
          shadowOpacity: 0.35,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 6,
          borderWidth: 2,
          borderColor: "#663530",
          position: "relative",
        }}
      >
        {/* Tam giác viền bám mép */}
        <View
          style={{
            position: "absolute",
            left: "-29%",
            marginRight: -BORDER_WIDTH,
            top: "29%",
            transform: [{ translateY: -TRI_OUTER }],
            width: 0,
            height: 0,
          }}
          pointerEvents="none"
        >
          <View
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              borderTopWidth: TRI_OUTER,
              borderBottomWidth: TRI_OUTER,
              borderRightWidth: TRI_OUTER_RIGHT,
              borderTopColor: "transparent",
              borderBottomColor: "transparent",
              borderRightColor: "#663530",
            }}
          />
          <View
            style={{
              position: "absolute",
              left: TRI_GAP,
              top: TRI_GAP,
              width: 0,
              height: 0,
              borderTopWidth: TRI_INNER,
              borderBottomWidth: TRI_INNER,
              borderRightWidth: TRI_INNER_RIGHT,
              borderTopColor: "transparent",
              borderBottomColor: "transparent",
              borderRightColor: "white",
            }}
          />
        </View>
        <Image
          source={require("../../../assets/icons/Door.png")}
          style={{ width: 28, height: 28 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const IntoHouseButton = memo(IntoHouseButtonComp);
export default IntoHouseButton;
