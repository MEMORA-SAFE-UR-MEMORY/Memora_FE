import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  defaultValue?: boolean;
};

const CustomSwitch = ({ defaultValue = false }: Props) => {
  const [isEnabled, setIsEnabled] = useState(defaultValue);

  const toggleSwitch = () => setIsEnabled(!isEnabled);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleSwitch}
      style={[
        styles.switch,
        { backgroundColor: isEnabled ? "#d1a4ff" : "#78788029" },
      ]}
    >
      <View style={[styles.knob, { left: isEnabled ? 57 : 5 }]} />
      <Text style={[styles.switchText, { color: isEnabled ? "#fff" : "#666" }]}>
        {isEnabled ? "Mở" : "Tắt"}
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
