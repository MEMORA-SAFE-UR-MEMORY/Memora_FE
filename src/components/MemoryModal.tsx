import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import InfoMemory from "@src/components/InfoMemory";
import ModalConfirm from "@src/components/ModalConfirm";
import ModalMenu from "@src/components/ModalMenu";
import UpdateMemory from "@src/components/UpdateMemory";
import { Memory } from "@src/types/memory";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  memory: Memory;
  onUpdate: (frameId: number, slotId: number, data: Memory) => void;
  onDelete: (frameId: number, slotId: number) => void;
  frameId: number | null;
  slotId: number | null;
  onFrameRemoved?: boolean;
  mode: "view" | "edit";
};

const MemoryModal = ({
  visible,
  onClose,
  memory,
  onUpdate,
  onDelete,
  frameId,
  slotId,
  onFrameRemoved,
  mode,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const [selected, setSelected] = useState<number>(1);
  const [showConfirm, setShowConfirm] = useState(false);

  const modalWidth = width * 0.4;
  const modalAnim = useRef(new Animated.Value(modalWidth)).current; // MemoryModal
  const menuAnim = useRef(new Animated.Value(modalWidth)).current; // ModalMenu

  // Khi visible thay đổi → animate in/out
  useEffect(() => {
    if (visible) {
      // Slide in
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
    } else {
      // Slide out
      Animated.parallel([
        Animated.timing(modalAnim, {
          toValue: modalWidth,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(menuAnim, {
          toValue: modalWidth,
          duration: 300,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) onClose();
      });
    }
  }, [visible]);

  const handleClose = () => {
    if (visible) {
      // để trigger slide out
      Animated.parallel([
        Animated.timing(modalAnim, {
          toValue: modalWidth,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(menuAnim, {
          toValue: modalWidth,
          duration: 300,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) onClose();
      });
    }
  };

  const handleDelete = () => {
    if (frameId != null && slotId != null) {
      setShowConfirm(false);
      onDelete(frameId, slotId);
      handleClose();
    }
  };

  useEffect(() => {
    setSelected(1);
  }, [memory.id]);

  useEffect(() => {
    if (onFrameRemoved) {
      handleClose(); // chạy animation slide out
    }
  }, [onFrameRemoved]);

  if (!visible) return null;

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
      {/* Nếu mode edit thì mới có menu, ngược lại chỉ xem */}
      {mode === "edit" && (
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
      )}

      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Ionicons name="close-circle" size={28} color="#B0B0B0" />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        {/* luôn có tab 1 = InfoMemory */}
        <InfoMemory memory={memory} />

        {/* Nếu là edit mode mới có update */}
        {mode === "edit" &&
          selected === 2 &&
          frameId != null &&
          slotId != null && (
            <UpdateMemory
              memory={memory}
              onUpdate={(data) => onUpdate(frameId, slotId, data)}
            />
          )}
      </View>

      {mode === "edit" && showConfirm && (
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
    zIndex: 200,
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
