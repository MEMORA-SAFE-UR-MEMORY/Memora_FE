import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";

type Props = {
  visible: boolean;
  title?: string;
  message?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
};

export default function ConfirmModal({
  visible,
  title = "Xác nhận",
  message = "Bạn có chắc không?",
  confirmText = "Đồng ý",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  loading = false,
}: Props) {
  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.4}
      onBackdropPress={onCancel}
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
          <Text style={styles.title}>{title}</Text>
          {typeof message === "string" ? (
            <Text style={styles.message}>{message}</Text>
          ) : (
            message
          )}
          <View style={styles.row}>
            <Pressable
              style={[styles.btn, styles.cancel]}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={[styles.btnText, styles.cancelText]}>
                {cancelText}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.danger]}
              onPress={onConfirm}
              disabled={loading}
            >
              <Text style={[styles.btnText, styles.dangerText]}>
                {loading ? "Đang xử lý…" : confirmText}
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 6,
    borderColor: "#E9D8FF",
    maxWidth: 515,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
    textAlign: "center",
    fontFamily: "Baloo2-medium",
  },
  message: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 14,
    textAlign: "center",
    fontFamily: "Baloo2-medium",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 2,
  },
  btnText: { fontSize: 15, fontWeight: "600", fontFamily: "Baloo2-medium" },
  cancel: { borderColor: "#e5e7eb", backgroundColor: "white" },
  cancelText: { color: "black" },
  danger: {
    borderColor: "#fecaca",
    backgroundColor: "#991b1b",
    borderRadius: 24,
  },
  dangerText: { color: "#fff" },
});
