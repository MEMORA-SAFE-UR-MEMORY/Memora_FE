import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Info } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AlbumInfoModal from "./AlbumInfoModal";

type Props = {
  title?: string;
  onBack?: () => void;
  backTo?: string;
  showInfoButton?: boolean;
  showOrdersButton?: boolean;
};

export default function MyAlbumsHeader({
  title = "Kho album",
  onBack,
  backTo,
  showInfoButton = false,
  showOrdersButton = false,
}: Props) {
  const router = useRouter();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <SafeAreaView edges={["top"]}>
      <View
        style={{
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 12,
          borderBottomWidth: 0.5,
          borderBottomColor: "#fdfefeff",
        }}
      >
        <Pressable
          onPress={
            onBack ?? (() => router.replace((backTo ?? "/album") as any))
          }
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
        {/* Right-side: Info button OR Orders button */}
        {showInfoButton ? (
          <Pressable
            onPress={() => setShowInfo(true)}
            style={{
              position: "absolute",
              right: 24,
              padding: 6,
              width: 32,
              height: 32,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#1f2227",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
            }}
            accessibilityRole="button"
            accessibilityLabel="Thông tin hướng dẫn album"
          >
            <Info size={18} color="#111827" />
          </Pressable>
        ) : showOrdersButton ? (
          <Pressable
            onPress={() => router.replace("/orders" as any)}
            style={{
              position: "absolute",
              right: 24,
              paddingHorizontal: 10,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#ffcfdf",
              alignItems: "center",
              justifyContent: "center",

              flexDirection: "row",
              gap: 6,
            }}
            accessibilityRole="button"
            accessibilityLabel="Đi tới đơn hàng"
          >
            <Ionicons name="receipt-outline" size={16} color="#111827" />
            <Text style={{ color: "#111827", fontWeight: "600" }}>
              Đơn hàng
            </Text>
          </Pressable>
        ) : null}
      </View>
      {showInfoButton && (
        <AlbumInfoModal visible={showInfo} onClose={() => setShowInfo(false)} />
      )}
    </SafeAreaView>
  );
}
