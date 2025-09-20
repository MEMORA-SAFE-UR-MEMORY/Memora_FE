import { Ionicons } from "@expo/vector-icons";
import BtnBorder, { ColorType } from "@src/components/BtnBorder";
import { ReactNode } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titleText: string;
  contentText: string;
  icon?: ReactNode; // icon truyền từ ngoài vào
  iconBgColor?: string;

  // confirm button
  confirmBtnText?: string;
  confirmBtnColor?: ColorType;

  // cancel button
  cancelBtnText?: string;
  cancelBtnColor?: ColorType;
};

const ModalConfirm = ({
  visible,
  onClose,
  onConfirm,
  titleText,
  contentText,
  icon,
  iconBgColor = "#F75270",
  confirmBtnText = "Xác nhận",
  confirmBtnColor = "green",
  cancelBtnText = "Hủy",
  cancelBtnColor = "grey",
}: Props) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
      supportedOrientations={["portrait", "landscape"]}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.titleText}>{titleText}</Text>

          {/* Close button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-circle" size={30} color="#B0B0B0" />
          </TouchableOpacity>

          <View style={styles.divider}></View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <View
              style={[styles.iconContainer, { backgroundColor: iconBgColor }]}
            >
              {icon}
            </View>

            <Text style={styles.contentText}>{contentText}</Text>

            {/* Buttons */}
            <View style={styles.btnContainer}>
              <BtnBorder
                text={cancelBtnText}
                colorType={cancelBtnColor}
                onPress={onClose}
              />
              <BtnBorder
                text={confirmBtnText}
                colorType={confirmBtnColor}
                onPress={onConfirm}
              />
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
  container: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 20,
    width: "60%",
  },
  titleText: {
    fontFamily: "Baloo2_bold",
    fontSize: 20,
    color: "#5C4D90",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 5,
    top: 5,
    padding: 5,
  },
  divider: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D3D3D3",
    marginBottom: 20,
    marginTop: 5,
  },
  contentContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  contentText: {
    fontFamily: "Baloo2_medium",
    fontSize: 15,
    textAlign: "center",
  },
  iconContainer: {
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  btnContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 5,
  },
});

export default ModalConfirm;
