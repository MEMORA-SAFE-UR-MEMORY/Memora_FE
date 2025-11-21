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
                    <Text style={styles.text}>{op.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.noteRow}>
            <Text style={styles.noteLabel}>Lưu ý: </Text>
            <Text style={styles.noteValue}>
              Ở chế độ Riêng tư, ảnh được lưu trong thiết bị của bạn. Nếu bạn
              xóa ảnh hoặc dữ liệu ứng dụng trên máy, những nội dung này sẽ bị
              mất vĩnh viễn.
            </Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "50%",
    borderWidth: 6,
    borderColor: "#E9D8FF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
  },
  label: {
    fontFamily: "Baloo2_semiBold",
    fontSize: 18,
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
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  opsUnselected: {
    borderRadius: 100,
    width: 20,
    height: 20,
    borderWidth: 1,
    backgroundColor: "white",
  },
  opsSelected: {
    backgroundColor: "#FFBCDD",
  },
  text: {
    fontFamily: "Baloo2_medium",
    fontSize: 16,
    color: "#333",
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
    marginBottom: 10,
    marginTop: 5,
  },
  noteLabel: {
    color: "red",
    fontFamily: "Baloo2_semiBold",
  },
  noteValue: {
    color: "#666",
    fontFamily: "Baloo2_medium",
    flex: 1,
    fontSize: 14,
  },
  addButton: {
    alignSelf: "center",
  },
});

export default RoomSetting;
