import React from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type UIDoor = {
  id: number;
  name: string;
  img_url?: string | null;
  image?: ImageSourcePropType;
  color_hex?: string;
  theme_id?: number | null;
};

type Props = {
  door: UIDoor;
  onPress: () => void;
};
export default function DoorItem({ door, onPress }: Props) {
  const source: ImageSourcePropType = door.img_url
    ? { uri: door.img_url }
    : (door.image ?? require("../../../assets/images/doors/default.png"));

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
          source={source}
          style={{
            width: "100%",
            height: "100%",
            marginTop: "auto",
            // marginLeft: 12,
          }}
          resizeMode="contain"
          onError={(e) => {
            console.log("Image load error:", door.img_url, e.nativeEvent.error);
          }}
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
