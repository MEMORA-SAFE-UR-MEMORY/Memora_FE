import { Door } from "@src/hooks/inHome/useDoors";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  door: Door;
  onPress: () => void;
};

export default function DoorItem({ door, onPress }: Props) {
  return (
    <TouchableOpacity
      style={{
        width: 160,
        height: 300,
        alignItems: "center",
        justifyContent: "flex-end",
      }}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={{ width: "100%", height: "100%", position: "relative" }}>
        <Image
          source={door.image}
          style={{
            width: "100%",
            height: "100%",
            marginTop: "auto",
            // marginLeft: 12,
          }}
          resizeMode="contain"
        />
        <Text
          style={{
            position: "absolute",
            width: "100%",
            top: -18,
            textAlign: "center",
            fontFamily: "Baloo2_bold",
            color: "#663530",
            fontSize: 14,
            // backgroundColor: "rgba(255,255,255,0.6)",
            borderRadius: 24,
            paddingHorizontal: 4,
          }}
        >
          {door.name || "Phòng"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
