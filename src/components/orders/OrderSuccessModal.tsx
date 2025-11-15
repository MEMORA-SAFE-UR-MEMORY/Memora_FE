import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onGoBack: () => void;
  onGoAlbum: () => void;
};

export default function OrderSuccessModal({
  visible,
  onGoBack,
  onGoAlbum,
}: Props) {
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
        <View
          style={{
            width: "100%",
            maxWidth: 480,
            borderRadius: 16,
            backgroundColor: "#fff",
            paddingHorizontal: 20,
            paddingVertical: 18,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 36,
              backgroundColor: "#ecfdf5",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Ionicons name="checkmark" size={40} color="#10b981" />
          </View>

          <Text
            style={{
              fontSize: 20,
              marginBottom: 2,
              fontFamily: "Baloo2_semiBold",
            }}
          >
            Đặt hàng thành công
          </Text>
          <Text
            style={{
              color: "#6b7280",
              textAlign: "center",
              marginBottom: 14,
              fontFamily: "Baloo2_medium",
              fontSize: 16,
            }}
          >
            Cảm ơn bạn! Đơn hàng của bạn đã được tạo.{"\n"}Vui lòng kiểm tra
            email để biết thêm chi tiết.
          </Text>

          <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
            <Pressable
              onPress={onGoBack}
              style={{
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
                  fontFamily: "Baloo2_medium",
                  fontSize: 16,
                }}
              >
                Quay về
              </Text>
            </Pressable>

            <Pressable
              onPress={onGoAlbum}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#7c3aed",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Baloo2_medium",
                  fontSize: 16,
                }}
              >
                Về trang Album
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
