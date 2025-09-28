import React from "react";
import { Animated, ImageSourcePropType, StyleSheet, View } from "react-native";

type Props = {
  wallSource: ImageSourcePropType;
  floorSource: ImageSourcePropType;
  floorHeight: number;
  wallWidth: number;
  floorWidth: number;
  scrollX: Animated.Value;
  parallax: number;
  onLoadStart: () => void;
  onLoadEnd: () => void;
};

export default function HallBackground({
  wallSource,
  floorSource,
  floorHeight,
  wallWidth,
  floorWidth,
  scrollX,
  parallax,
  onLoadStart,
  onLoadEnd,
}: Props) {
  return (
    <>
      {/* Wall */}
      <View pointerEvents="none" style={styles.wall}>
        <Animated.Image
          source={wallSource}
          resizeMode="cover"
          style={[
            styles.wallImage,
            {
              width: wallWidth,
              transform: [
                { translateX: Animated.multiply(scrollX, -parallax) },
              ],
            },
          ]}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
        />
      </View>

      {/* Floor (giữ nguyên: stretch + height) */}
      <View
        pointerEvents="none"
        style={[styles.floorContainer, { height: floorHeight }]}
      >
        <Animated.Image
          source={floorSource}
          resizeMode="stretch"
          style={{
            width: floorWidth,
            height: floorHeight,
            transform: [{ translateX: Animated.multiply(scrollX, -parallax) }],
          }}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wall: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
  },
  wallImage: {
    width: "100%",
    height: "100%",
  },
  floorContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 2,
    overflow: "hidden",
  },
});
