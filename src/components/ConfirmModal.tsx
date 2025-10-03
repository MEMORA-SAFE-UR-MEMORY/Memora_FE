import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

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
          <View
            style={{
              width: "99%",
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text style={styles.title}>Xác nhận mua hàng</Text>
            <Text style={styles.message}>
              Bạn có chắc muốn mua
              <Text style={styles.highlight}>{itemName}</Text> với giá
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
    width: "50%",
    backgroundColor: "#E9D8FF",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: "Baloo2-Bold",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    fontFamily: "Baloo2-SemiBold",
  },
  highlight: {
    fontWeight: "700",
    color: "#FFBCDD",
    fontFamily: "Baloo2-Bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#D9D9D9",
  },
  confirmButton: {
    backgroundColor: "#FFBCDD",
  },
  cancelText: {
    color: "#333",
    fontFamily: "Baloo2-SemiBold",
  },
  confirmText: {
    color: "#fff",
    fontFamily: "Baloo2-SemiBold",
  },
});

export default ConfirmBuyModal;
