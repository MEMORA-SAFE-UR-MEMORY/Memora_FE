import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  value: boolean;
  onToggle: () => void;
};

const CustomSwitch = ({ value, onToggle }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      style={[
        styles.switch,
        { backgroundColor: value ? "#d1a4ff" : "#78788029" },
      ]}
    >
      <View style={[styles.knob, { left: value ? 57 : 5 }]} />
      <Text style={[styles.switchText, { color: value ? "#fff" : "#666" }]}>
        {value ? "Mở" : "Tắt"}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomSwitch;

const styles = StyleSheet.create({
  switch: {
    width: 78,
    height: 25,
    borderRadius: 50,
    justifyContent: "center",
    marginTop: 6,
  },
  knob: {
    position: "absolute",
    top: 4,
    width: 16,
    height: 16,
    borderRadius: 50,
    backgroundColor: "white",
    elevation: 2,
  },
  switchText: {
    position: "absolute",
    alignSelf: "center",
    fontSize: 14,
    fontWeight: "600",
  },
});
