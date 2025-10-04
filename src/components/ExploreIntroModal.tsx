import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (dontShowAgain: boolean) => void;
};

export default function ExploreIntroModal({
  visible,
  onClose,
  onConfirm,
}: Props) {
  const [dontShow, setDontShow] = useState(false);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={["portrait", "landscape"]}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 420,
            backgroundColor: "#FFF",
            borderRadius: 16,
            borderWidth: 2,
            borderColor: "#663530",
            padding: 18,
          }}
        >
          <Text
            style={{
              color: "#663530",
              fontFamily: "Baloo2_bold",
              fontSize: 20,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Ghé qua một nơi đang mở
          </Text>
          <Text
            style={{
              color: "#5b3a36",
              fontFamily: "Baloo2_medium",
              fontSize: 16,
              textAlign: "center",
              lineHeight: 20,
              marginBottom: 14,
            }}
          >
            Tụi mình sẽ đưa bạn đến ngẫu nhiên một căn phòng đang được mở. Bạn
            chỉ việc ngồi xem thật nhẹ, như ghé qua một góc nhỏ ấm áp của ai đó.
            Khi muốn, bạn có thể rời đi bất kỳ lúc nào.
          </Text>

          <TouchableOpacity
            onPress={() => setDontShow((v) => !v)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 4,
              marginBottom: 14,
            }}
            activeOpacity={0.8}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: "#663530",
                backgroundColor: dontShow ? "#663530" : "#fff",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
              }}
            >
              {dontShow ? (
                <Text
                  style={{ color: "#fff", fontWeight: "700", marginTop: -2 }}
                >
                  ✓
                </Text>
              ) : null}
            </View>
            <Text
              style={{
                color: "#663530",
                fontFamily: "Baloo2_medium",
                fontSize: 14,
              }}
            >
              Không hiện lại
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                height: 42,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#663530",
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#663530",
                  fontFamily: "Baloo2_bold",
                  fontSize: 16,
                }}
              >
                Để sau
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onConfirm(dontShow)}
              style={{
                flex: 1,
                height: 42,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#663530",
                backgroundColor: "#FFE6CC",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#663530",
                  fontFamily: "Baloo2_bold",
                  fontSize: 16,
                }}
              >
                Khám phá ngay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
