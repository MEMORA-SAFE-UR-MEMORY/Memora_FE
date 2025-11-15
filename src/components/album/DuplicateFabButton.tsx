import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

type Props = {
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
  label?: string;
};

export default function DuplicateFabButton({
  onPress,
  loading,
  style,
  label = "Tạo bản sao",
}: Props) {
  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      style={[styles.btn, style, loading && { opacity: 0.7 }]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <>
          <Ionicons
            name="copy-outline"
            color="#fff"
            size={18}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.txt}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: "absolute",
    right: 12,
    bottom: 12,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#89D1FD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    elevation: 4,
  },
  txt: { color: "#fff", fontFamily: "Baloo2_semiBold" },
});
