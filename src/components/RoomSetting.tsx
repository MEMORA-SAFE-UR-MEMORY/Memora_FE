import { Ionicons } from "@expo/vector-icons";
import BtnBorder from "@src/components/BtnBorder";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (type: "private" | "public") => void;
  currentType: "private" | "public";
};

type Option = {
  label: string;
  value: "private" | "public";
};

const RoomSetting: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  currentType,
}) => {
  const ops: Option[] = [
    {
      label: "Riêng tư",
      value: "private",
    },
    {
      label: "Công khai",
      value: "public",
    },
  ];

  const [selected, setSelected] = useState<"private" | "public">(currentType);

  useEffect(() => {
    setSelected(currentType);
  }, [currentType]);

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
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Cài đặt phòng</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-circle" size={30} color="#B0B0B0" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Quyền truy cập:</Text>
            <View style={styles.opsContainer}>
              {ops.map((op) => {
                const isSelected = selected === op.value;
                return (
                  <View key={op.value} style={styles.opsRow}>
                    <Pressable
                      style={[
                        styles.opsUnselected,
                        isSelected && styles.opsSelected,
                      ]}
                      onPress={() => setSelected(op.value)}
                    ></Pressable>
                    <Text>{op.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.addButton}>
            <BtnBorder
              text="Lưu"
              fontSize={15}
              colorType={"pink"}
              onPress={() => onSave(selected)}
            />
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
  content: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "50%",
    borderColor: "#E9D8FF",
    borderWidth: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Baloo2_bold",
    color: "#5C4D90",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    right: -20,
    top: -20,
    padding: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 20,
  },
  label: {
    fontFamily: "Baloo2_bold",
    fontSize: 15,
    color: "#333",
  },
  opsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
  },
  opsRow: {
    flexDirection: "row",
    gap: 10,
  },
  opsUnselected: {
    borderRadius: 100,
    padding: 10,
    borderWidth: 1,
    backgroundColor: "white",
  },
  opsSelected: {
    backgroundColor: "#FFBCDD",
  },
  text: {
    fontFamily: "Baloo2_medium",
    fontSize: 15,
    color: "#333",
  },
  addButton: {
    alignSelf: "center",
  },
});

export default RoomSetting;
