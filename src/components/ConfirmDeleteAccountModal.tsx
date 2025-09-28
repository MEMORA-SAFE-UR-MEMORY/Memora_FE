import React from "react";
import {
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function ConfirmDeleteAccountModal({
  visible,
  onCancel,
  onConfirm,
  loading,
}: Props) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
      supportedOrientations={["portrait", "landscape"]}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "88%",
            maxWidth: 600,
            backgroundColor: "white",
            borderRadius: 12,
            padding: 18,
            borderWidth: 6,
            borderColor: "#E9D8FF",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              marginBottom: 2,
              color: "#111",
              textAlign: "center",
              fontFamily: "Baloo2_bold",
            }}
          >
            Xóa tài khoản?
          </Text>

          <Text
            style={{
              fontSize: 17,
              color: "#333",
              marginBottom: 16,
              textAlign: "center",
              fontFamily: "Baloo2_medium",
            }}
          >
            Chúng tôi trân trọng những gì bạn đã lưu giữ{"\n"}Nếu bạn vẫn muốn
            đóng lại hành trình này, mọi ký ức sẽ được xóa vĩnh viễn.
          </Text>

          <View
            style={{ flexDirection: "row", justifyContent: "center", gap: 12 }}
          >
            <TouchableOpacity
              onPress={onCancel}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 24,
                borderWidth: 2,
                borderColor: "#e5e7eb",
                backgroundColor: "white",
                minWidth: 120,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Baloo2_medium",
                  fontWeight: "500",
                  fontSize: 16,
                  color: "black",
                  textAlign: "center",
                }}
              >
                Quay lại
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={loading}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 24,
                borderWidth: 2,
                borderColor: "#fecaca",
                backgroundColor: "#991b1b",
                minWidth: 120,
                alignItems: "center",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#ffffff",
                  fontFamily: "Baloo2_medium",
                }}
              >
                {loading ? "Đang xóa…" : "Xóa tài khoản"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
