import React from "react";
import { ActivityIndicator, StyleSheet, View, ViewStyle } from "react-native";

type Props = { visible: boolean; style?: ViewStyle };

export default function BlockingOverlay({ visible, style }: Props) {
  if (!visible) return null;
  return (
    <View style={[styles.overlay, style]}>
      <ActivityIndicator size="large" color="#D2A4FF" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});
