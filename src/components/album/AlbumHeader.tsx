import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title?: string;
  onBack?: () => void;
};

export default function AlbumHeader({
  title = "Chọn một mẫu, viết nên hồi ức",
  onBack,
}: Props) {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]}>
      <View
        style={{
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#1f2227",
        }}
      >
        <Pressable
          onPress={onBack ?? (() => router.replace("/home"))}
          style={{ position: "absolute", left: 24, padding: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <Image
            source={require("../../../assets/icons/backIcon.png")}
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
          />
        </Pressable>
        <Text
          numberOfLines={1}
          style={{
            color: "#000000",
            fontSize: 20,
            fontWeight: "600",
            fontFamily: "Baloo2-medium",
          }}
        >
          {title}
        </Text>
      </View>
    </SafeAreaView>
  );
}
