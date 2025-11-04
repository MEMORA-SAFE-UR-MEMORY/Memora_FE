import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import OrderInfoModal from "@src/components/orders/OrderInfoModal";
import OrderSuccessModal from "@src/components/orders/OrderSuccessModal";
import { router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { useOrderableAlbums } from "services/album/hook";
import { useCreateOrder } from "services/orders/hook";

export default function OrdersScreen() {
  useFocusEffect(
    React.useCallback(() => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      ).catch(() => {});
      return () => {
        // Keep landscape on blur (no revert)
      };
    }, [])
  );
  const { data, loading, error, reload } = useOrderableAlbums();
  const { submitting, submit } = useCreateOrder();
  const [selected, setSelected] = useState<number[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedAlbums = useMemo(
    () => data.filter((a: any) => selected.includes(a.id)),
    [data, selected]
  );

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const canProceed = selected.length >= 1;

  const renderItem = ({ item }: any) => {
    const checked = selected.includes(item.id);
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          gap: 12,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 8,
            backgroundColor: "#f3f4f6",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {item.cover_url ? (
            <Image
              source={{ uri: item.cover_url }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="images-outline" size={22} color="#6b7280" />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Baloo2_medium",
            }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              color: "#6b7280",
              marginTop: 2,
              fontSize: 14,
              fontFamily: "Baloo2_medium",
            }}
          >
            Đã đủ ảnh: {item.filled_slots}/{item.total_slots}
          </Text>
        </View>

        <Pressable
          onPress={() => toggle(item.id)}
          hitSlop={8}
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          accessibilityLabel={`Chọn album ${item.name}`}
        >
          <Ionicons
            name={checked ? "checkbox" : "square-outline"}
            size={22}
            color={checked ? "#7c3aed" : "#111827"}
          />
        </Pressable>
      </View>
    );
  };

  if (loading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );

  if (error)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "red" }}>{error}</Text>
        <Pressable
          onPress={reload}
          style={{
            marginTop: 12,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: "#efefef",
          }}
        >
          <Text>Thử lại</Text>
        </Pressable>
      </View>
    );

  if (data.length === 0)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text className="fontFamily: Baloo2_medium">
          Chưa có album nào đủ ảnh để đặt.
        </Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingLeft: 24 }}
      />

      <View
        style={{
          paddingTop: 10,
          paddingHorizontal: 24,
          paddingBottom: 12,
          borderTopWidth: 1,
          borderTopColor: "#eee",
          backgroundColor: "#fff",
        }}
      >
        <Pressable
          disabled={!canProceed}
          onPress={() => setShowOrderModal(true)}
          style={{
            height: 44,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: canProceed ? "#7c3aed" : "#e5e7eb",
          }}
        >
          <Text
            style={{
              color: canProceed ? "#fff" : "#9ca3af",

              fontSize: 16,
              fontFamily: "Baloo2_medium",
            }}
          >
            {canProceed
              ? `Tiếp tục (${selected.length} album)`
              : "Chọn ít nhất 1 album"}
          </Text>
        </Pressable>
      </View>

      <OrderInfoModal
        visible={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        selectedAlbums={selectedAlbums}
        onSubmit={async (payload) => {
          try {
            const res = await submit(payload);
            console.log("[Order] Submit success:", res);
            setShowOrderModal(false);
            setShowSuccess(true);
          } catch (e: any) {
            console.error("[Order] Submit error:", e?.message || e);
            // Optional simple feedback; replace with toast if available
            alert(e?.message || "Đặt hàng thất bại");
          }
        }}
      />

      <OrderSuccessModal
        visible={showSuccess}
        onGoBack={() => {
          setShowSuccess(false);
          router.back();
        }}
        onGoAlbum={() => {
          setShowSuccess(false);
          router.replace("/album");
        }}
      />

      {/* Fullscreen loading while submitting order */}
      <Modal visible={submitting} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              gap: 12,
              paddingHorizontal: 20,
              paddingVertical: 18,
              borderRadius: 12,
              backgroundColor: "#111827",
            }}
          >
            <ActivityIndicator color="#fff" size="large" />
            <Text style={{ color: "#fff", fontFamily: "Baloo2_medium" }}>
              Đang xử lý đơn hàng…
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
