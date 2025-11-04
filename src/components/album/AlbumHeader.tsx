import { Ionicons } from "@expo/vector-icons";
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
          height: 45,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 12,
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
            fontSize: 18,

            fontFamily: "Baloo2_medium",
          }}
        >
          {title}
        </Text>
        <Pressable
          onPress={() => router.replace("/my-albums" as any)}
          style={{
            position: "absolute",
            right: 24,
            flexDirection: "row",
            gap: 6,
            alignItems: "center",
            backgroundColor: "#ffcfdf",
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 24,
          }}
        >
          <Ionicons name="albums-outline" size={16} color="#374151" />
          <Text style={{ color: "#374151", fontFamily: "Baloo2_semiBold" }}>
            Kho album
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
