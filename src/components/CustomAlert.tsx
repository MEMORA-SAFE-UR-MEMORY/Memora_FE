import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function CustomAlert({
  visible,
  onClose,
  message,
  title = "Thông báo",
  buttonText = "OK",
}: {
  visible: boolean;
  onClose: () => void;
  message: string;
  title?: string;
  buttonText?: string;
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      supportedOrientations={["landscape", "portrait"]}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            width: 320,
            padding: 24,
            backgroundColor: "white",
            borderWidth: 6,
            borderColor: "#E9D8FF",
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          {/* Title */}
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Baloo2_semiBold",
              marginBottom: 12,
              color: "#333",
            }}
          >
            {title}
          </Text>

          {/* Message */}
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Baloo2_medium",
              marginBottom: 20,
              color: "#555",
              lineHeight: 20,
            }}
          >
            {message}
          </Text>

          {/* Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              alignSelf: "flex-end",
              backgroundColor: "#D2A4FF",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Baloo2_semiBold",
                fontSize: 14,
              }}
            >
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
