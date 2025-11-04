import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AlbumInfoModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      supportedOrientations={["portrait", "landscape"]}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
            maxHeight: "70%",
            maxWidth: 515,
            borderWidth: 6,
            borderColor: "#E9D8FF",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                flex: 1,
                fontSize: 20,
                fontFamily: "Baloo2_semiBold",
                textAlign: "center",
              }}
            >
              Hướng dẫn sử dụng album
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Đóng"
              style={{
                padding: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 18 }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={{ marginTop: 8 }}>
            <Text style={{ marginBottom: 8, fontFamily: "Baloo2_semiBold" }}>
              - Chọn ô ảnh cần thay → bấm “Tải ảnh/Thay ảnh”.
            </Text>
            <Text style={{ marginBottom: 8, fontFamily: "Baloo2_semiBold" }}>
              - Chọn hình từ thư viện hoặc chụp mới. Đợi thanh trạng thái tải
              xong.
            </Text>
            <Text style={{ marginBottom: 8, fontFamily: "Baloo2_semiBold" }}>
              - Ảnh sẽ hiển thị ngay khi tải thành công. Có thể thay lại bất cứ
              lúc nào.
            </Text>
            <Text style={{ marginBottom: 8, fontFamily: "Baloo2_semiBold" }}>
              - Định dạng hỗ trợ: JPG, PNG, HEIC. Nên dùng ảnh ≥ 1500px cho chất
              lượng in.
            </Text>
            <Text style={{ marginBottom: 8, fontFamily: "Baloo2_semiBold" }}>
              - Kiểm tra kết nối mạng ổn định để quá trình tải ảnh không bị gián
              đoạn.
            </Text>
            <Text style={{ marginBottom: 8, fontFamily: "Baloo2_semiBold" }}>
              - Sau khi hoàn tất, trở về “Kho album” để xem lại hoặc đặt in.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
