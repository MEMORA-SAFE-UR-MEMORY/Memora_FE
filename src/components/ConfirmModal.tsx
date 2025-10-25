import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ConfirmBuyModalProps = {
  visible: boolean;
  itemName: string;
  price: number;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmBuyModal = ({
  visible,
  itemName,
  price,
  onConfirm,
  onCancel,
}: ConfirmBuyModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
      supportedOrientations={["landscape", "portrait"]}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View>
            <Text style={styles.title}>Xác nhận mua hàng</Text>
            <Text style={styles.message}>
              Bạn có chắc muốn mua{" "}
              <Text style={styles.highlight}>{itemName}</Text> với giá{" "}
              <Text style={styles.highlight}>{price} puzzles</Text>?
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={styles.cancelText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={onConfirm}
              >
                <Text style={styles.confirmText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "40%",
    borderWidth: 6,
    borderColor: "#E9D8FF",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
    fontFamily: "Baloo2_semiBold",
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    fontFamily: "Baloo2_medium",
  },
  highlight: {
    color: "#FFBCDD",
    fontFamily: "Baloo2_semiBold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
    marginHorizontal: 10,
    alignItems: "center",
  },
  cancelButton: {
    borderColor: "#e5e7eb",
    backgroundColor: "white",
  },
  confirmButton: {
    backgroundColor: "#FFBCDD",
    borderColor: "#efa3c9ff",
  },
  cancelText: {
    color: "#333",
    fontSize: 16,
    fontFamily: "Baloo2_semiBold",
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Baloo2_semiBold",
  },
});

export default ConfirmBuyModal;
