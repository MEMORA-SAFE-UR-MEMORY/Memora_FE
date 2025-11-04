import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  primaryText?: string;
  secondaryText?: string;
  onPrimary?: () => void;
  onClose: () => void;
};

export default function CloneSuccessModal({
  visible,
  title = "Tạo album thành công",
  message = "Một cuốn sổ trống vừa mở ra\n Mở ra, viết tiếp câu chuyện và ghép từng kỷ niệm nhé!",
  primaryText = "Đến Kho album",
  secondaryText = "Để sau",
  onPrimary,
  onClose,
}: Props) {
  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      useNativeDriver
      supportedOrientations={["portrait", "landscape"]}
    >
      <SafeAreaView
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{message}</Text>

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={[styles.btn, styles.btnGhost]}>
              <Text style={[styles.btnTxt, styles.btnGhostTxt]}>
                {secondaryText}
              </Text>
            </Pressable>
            <Pressable
              onPress={onPrimary}
              style={[styles.btn, styles.btnPrimary]}
            >
              <Text style={[styles.btnTxt, styles.btnPrimaryTxt]}>
                {primaryText}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: "white",
    borderWidth: 6,
    borderColor: "#E9D8FF",
    borderRadius: 12,
    maxWidth: 515,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eafff0",
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    color: "#111827",
    marginBottom: 6,
    fontFamily: "Baloo2_medium",
  },
  desc: {
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 15,
    fontFamily: "Baloo2_medium",
  },
  actions: { flexDirection: "row", gap: 10, marginTop: 4 },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
  },
  btnTxt: { fontWeight: "600", fontFamily: "Baloo2_medium", fontSize: 16 },
  btnGhost: { borderColor: "#e5e7eb", backgroundColor: "white" },
  btnGhostTxt: { color: "black" },
  btnPrimary: { borderColor: "#bea8e5ff", backgroundColor: "#7c3aed" },
  btnPrimaryTxt: { color: "#fff" },
});
