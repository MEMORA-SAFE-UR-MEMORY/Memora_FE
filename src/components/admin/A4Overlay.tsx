import React from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  source: any;
  mode?: "landscape" | "portrait"; // A4 orientation
  margin?: number; // outer margin to keep away from edges
};

// A4 ratios: portrait width/height = 1/√2, landscape width/height = √2
const A4_RATIO_LANDSCAPE = Math.SQRT2; // ~1.414
const A4_RATIO_PORTRAIT = 1 / Math.SQRT2; // ~0.707

export default function A4Overlay({
  source,
  mode = "landscape",
  margin = 12,
}: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const maxW = Math.max(0, width - (insets.left + insets.right) - margin * 2);
  const maxH = Math.max(0, height - (insets.top + insets.bottom) - margin * 2);

  const ratio = mode === "landscape" ? A4_RATIO_LANDSCAPE : A4_RATIO_PORTRAIT; // width/height

  // Fit A4 box into max box while preserving aspect ratio
  let w = maxW;
  let h = w / ratio;
  if (h > maxH) {
    h = maxH;
    w = h * ratio;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.center}>
        <Image
          source={source}
          resizeMode="contain"
          style={{ width: w, height: h }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
