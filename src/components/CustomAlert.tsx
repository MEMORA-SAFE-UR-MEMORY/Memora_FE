import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

export default function CustomAlert({ visible, onClose, message }: any) {
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
            width: 300,
            padding: 20,
            backgroundColor: "white",
            borderRadius: 10,
          }}
        >
          <Text style={{ marginBottom: 20 }}>{message}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: "blue", textAlign: "right" }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
