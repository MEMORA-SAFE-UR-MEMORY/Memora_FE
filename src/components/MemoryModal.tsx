import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ModalMenu from "@src/components/ModalMenu";
import UpdateMemory from "@src/components/UpdateMemory";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import InfoMemory from "./InfoMemory";
import ModalConfirm from "./ModalConfirm";

type Props = {
  onClose: () => void;
  memory: {
    title: string;
    description: string;
    image: string | null;
    date: string;
  };
  onUpdate: (data: {
    title: string;
    description: string;
    image: string | null;
    date: string;
  }) => void;
  onDelete: () => void;
};

const MemoryModal = ({ onClose, memory, onUpdate, onDelete }: Props) => {
  const { width, height } = useWindowDimensions();
  const [selected, setSelected] = useState<number>(1);
  const [showConfirm, setShowConfirm] = useState(false);

  const modalWidth = width * 0.4;
  const modalAnim = useRef(new Animated.Value(modalWidth)).current; // MemoryModal
  const menuAnim = useRef(new Animated.Value(modalWidth)).current; // ModalMenu

  // Khi mount: menu -> modal
  useEffect(() => {
    Animated.parallel([
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 300,
        delay: 200, // delay nhẹ
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    // Khi đóng: modal -> menu
    Animated.parallel([
      Animated.timing(modalAnim, {
        toValue: modalWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(menuAnim, {
        toValue: modalWidth,
        duration: 300,
        delay: 200, // delay nhẹ
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onClose();
    });
  };

  const handleDelete = () => {
    setShowConfirm(false);
    onDelete();
    handleClose();
  };

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          width: modalWidth,
          height: height,
          transform: [{ translateX: modalAnim }],
        },
      ]}
    >
      <ModalMenu
        modalWidth={modalWidth}
        slideAnim={menuAnim}
        selected={selected}
        setSelected={(id) => {
          if (id === 3) {
            setShowConfirm(true);
          } else {
            setSelected(id);
          }
        }}
      />
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Ionicons name="close-circle" size={28} color="#B0B0B0" />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        {selected === 1 && <InfoMemory memory={memory} />}
        {selected === 2 && <UpdateMemory memory={memory} onUpdate={onUpdate} />}
      </View>

      {showConfirm && (
        <ModalConfirm
          visible={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          titleText="Xác nhận xóa"
          contentText="Bạn có chắc chắn muốn xóa kỷ niệm này không?"
          icon={<MaterialIcons name="delete-forever" size={40} color="white" />}
          iconBgColor="#F75270"
          confirmBtnText="Xóa"
          confirmBtnColor="red"
          cancelBtnText="Hủy"
          cancelBtnColor="grey"
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    padding: 5,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 5,
    padding: 5,
    zIndex: 10,
  },
});
export default MemoryModal;
