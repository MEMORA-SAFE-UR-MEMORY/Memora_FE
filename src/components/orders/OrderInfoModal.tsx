import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export type SelectedAlbum = {
  id: number;
  name: string;
  cover_url?: string | null;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedAlbums: SelectedAlbum[];
  onSubmit: (payload: {
    fullName: string;
    address: string;
    phone: string;
    orderAlbums: { albumId: number; quantity: number; price: number }[];
    totalPrice: number;
  }) => Promise<void> | void;
};

export default function OrderInfoModal({
  visible,
  onClose,
  selectedAlbums,
  onSubmit,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const canSubmit =
    fullName.trim().length > 0 &&
    address.trim().length > 0 &&
    phone.trim().length > 0 &&
    (selectedAlbums?.length ?? 0) > 0;

  // Sync quantities with selected albums (default 1)
  useEffect(() => {
    setQuantities((prev) => {
      const next: Record<number, number> = {};
      for (const a of selectedAlbums) {
        next[a.id] = prev[a.id] ?? 1;
      }
      return next;
    });
  }, [selectedAlbums]);

  const PRICE_PER_ALBUM = 350_000;
  const formatVnd = (n: number) =>
    n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  const totalPrice = useMemo(() => {
    return selectedAlbums.reduce((sum, a) => {
      const qty = quantities[a.id] ?? 1;
      return sum + qty * PRICE_PER_ALBUM;
    }, 0);
  }, [selectedAlbums, quantities]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      supportedOrientations={["portrait", "landscape"]}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        {/* Background tap area to dismiss keyboard */}
        <Pressable
          onPress={Keyboard.dismiss}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Content card (does not intercept background taps) */}
        <View
          style={{
            width: "100%",
            maxWidth: 600,
            maxHeight: "85%",
            borderRadius: 16,
            backgroundColor: "#fff",
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}
          pointerEvents={submitting ? "none" : "auto"}
        >
          <Text
            style={{
              fontSize: 18,
              marginBottom: 12,
              fontFamily: "Baloo2_semiBold",
              textAlign: "center",
            }}
          >
            Thông tin đơn hàng
          </Text>
          <ScrollView
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
          >
            {/* Section 1: form in two columns */}
            <View style={{ flexDirection: "row", gap: 16 }}>
              {/* Left column: Full name + Phone */}
              <View style={{ flex: 1, gap: 8 }}>
                <Text
                  style={{
                    fontFamily: "Baloo2_semiBold",
                    color: "#7c3aed",
                  }}
                >
                  Họ và tên
                </Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Nhập họ và tên"
                  placeholderTextColor="#9ca3af"
                  editable={!submitting}
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    color: "#111827",
                    fontFamily: "Baloo2_medium",
                  }}
                />

                <Text
                  style={{
                    fontFamily: "Baloo2_semiBold",
                    color: "#7c3aed",
                  }}
                >
                  Số điện thoại
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  editable={!submitting}
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    color: "#111827",
                    fontFamily: "Baloo2_medium",
                  }}
                />
              </View>

              {/* Right column: Address */}
              <View style={{ flex: 1, gap: 8 }}>
                <Text
                  style={{
                    fontFamily: "Baloo2_semiBold",
                    color: "#7c3aed",
                  }}
                >
                  Địa chỉ
                </Text>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Nhập địa chỉ nhận hàng"
                  placeholderTextColor="#9ca3af"
                  editable={!submitting}
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    color: "#111827",
                    minHeight: 80,
                    textAlignVertical: "top",
                    fontFamily: "Baloo2_medium",
                  }}
                  multiline
                />
              </View>
            </View>

            {/* Section 2: selected albums list */}
            <View>
              <Text
                style={{
                  marginBottom: 8,
                  fontFamily: "Baloo2_semiBold",
                  color: "#7c3aed",
                }}
              >
                Album đã chọn
              </Text>
              <View style={{ gap: 8 }}>
                {selectedAlbums.map((a) => (
                  <View
                    key={a.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 6,
                        backgroundColor: "#f3f4f6",
                        overflow: "hidden",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {a.cover_url ? (
                        <Image
                          source={{ uri: a.cover_url }}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons
                          name="images-outline"
                          size={18}
                          color="#6b7280"
                        />
                      )}
                    </View>
                    <Text
                      style={{ flex: 1, fontFamily: "Baloo2_medium" }}
                      numberOfLines={1}
                    >
                      {a.name}
                    </Text>

                    {/* Quantity controls */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Pressable
                        disabled={submitting}
                        onPress={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [a.id]: Math.max(1, (prev[a.id] ?? 1) - 1),
                          }))
                        }
                        hitSlop={8}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f3f4f6",
                        }}
                      >
                        <Ionicons name="remove" size={16} color="#111827" />
                      </Pressable>

                      <Text
                        style={{
                          minWidth: 20,
                          textAlign: "center",
                          fontFamily: "Baloo2_medium",
                        }}
                      >
                        {quantities[a.id] ?? 1}
                      </Text>

                      <Pressable
                        disabled={submitting}
                        onPress={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [a.id]: Math.min(999, (prev[a.id] ?? 1) + 1),
                          }))
                        }
                        hitSlop={8}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f3f4f6",
                        }}
                      >
                        <Ionicons name="add" size={16} color="#111827" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Section 3: warning + pricing */}
            <View
              style={{
                marginTop: 4,
                backgroundColor: "#FEF3C7",
                padding: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#F59E0B",
              }}
            >
              <Text style={{ color: "#92400E", fontFamily: "Baloo2_medium" }}>
                Lưu ý: Đặt hàng là không thể hủy. Vui lòng kiểm tra kỹ thông tin
                trước khi xác nhận.
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: "#6b7280", fontFamily: "Baloo2_medium" }}>
                Đơn giá: {formatVnd(PRICE_PER_ALBUM)}/album
              </Text>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 18,
                  fontFamily: "Baloo2_medium",
                }}
              >
                Tổng: {formatVnd(totalPrice)}
              </Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            <Pressable
              disabled={submitting}
              onPress={onClose}
              style={{
                display: submitting ? "none" : "flex",
                flex: 1,
                height: 44,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e5e7eb",
              }}
            >
              <Text
                style={{
                  color: "#111827",
                  fontWeight: "600",
                  fontFamily: "Baloo2_medium",
                  fontSize: 16,
                }}
              >
                Hủy
              </Text>
            </Pressable>

            <Pressable
              disabled={submitting || !canSubmit}
              onPress={() => {
                Alert.alert(
                  "Xác nhận đặt hàng",
                  "Lưu ý: Đặt hàng là không thể hủy. Bạn có chắc muốn xác nhận?",
                  [
                    { text: "Hủy", style: "cancel" },
                    {
                      text: "Đồng ý",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          setSubmitting(true);
                          const orderAlbums = selectedAlbums.map((a) => ({
                            albumId: a.id,
                            quantity: quantities[a.id] ?? 1,
                            price: PRICE_PER_ALBUM,
                          }));
                          await onSubmit({
                            fullName,
                            address,
                            phone,
                            orderAlbums,
                            totalPrice,
                          });
                          onClose();
                        } finally {
                          setSubmitting(false);
                        }
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: submitting
                  ? "#a78bfa"
                  : canSubmit
                    ? "#7c3aed"
                    : "#e5e7eb",
              }}
            >
              <Text
                style={{
                  color: submitting || !canSubmit ? "#9ca3af" : "#fff",

                  fontFamily: "Baloo2_semiBold",
                  fontSize: 16,
                }}
              >
                {submitting ? "Đang đặt…" : "Đặt đơn hàng"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
