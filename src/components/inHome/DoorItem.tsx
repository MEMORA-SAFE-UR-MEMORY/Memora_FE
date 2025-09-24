import React from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
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
  const { width, height } = useWindowDimensions();
  const shortest = Math.min(width, height);

  const baseScale = Math.min(1, shortest / 414);
  const extraShrink =
    shortest <= 320
      ? 0.75
      : shortest <= 360
        ? 0.82
        : shortest <= 375
          ? 0.88
          : 1;

  // Thu nhỏ nhẹ cho màn lớn (big phones/tablets)
  const largeShrink =
    shortest >= 768
      ? 0.85 // tablet
      : shortest >= 520
        ? 0.92 // điện thoại lớn
        : shortest > 414
          ? 0.95
          : 1; // lớn hơn iPhone 11 một xíu

  const scale = baseScale * extraShrink * largeShrink;

  const doorWidth = Math.round(160 * scale);
  const doorHeight = Math.round(300 * scale);
  const nameFont = Math.max(11, Math.round(14 * scale));
  const nameTop = -Math.round(18 * scale);

  const source: ImageSourcePropType = door.img_url
    ? { uri: door.img_url }
    : (door.image ?? require("../../../assets/images/doors/default.png"));

  return (
    <TouchableOpacity
      style={{
        width: doorWidth,
        height: doorHeight,
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
            top: nameTop,
            textAlign: "center",
            fontFamily: "Baloo2_bold",
            color: "#663530",
            fontSize: nameFont,
            // backgroundColor: "rgba(255,255,255,0.6)",
            borderRadius: 24,
            paddingHorizontal: 4,
          }}
          numberOfLines={1}
        >
          {door.name || "Phòng"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
