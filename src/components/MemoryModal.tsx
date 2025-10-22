import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AddMemoryModal from "@src/components/AddMemoryModal";
import { FrameView } from "@src/components/FrameView";
import InfoMemory from "@src/components/InfoMemory";
import LoadingOverlay from "@src/components/LoadingOverlay";
import ModalConfirm from "@src/components/ModalConfirm";
import ModalMenu from "@src/components/ModalMenu";
import UpdateMemory from "@src/components/UpdateMemory";
import { RoomItem } from "@src/types/item";
import { Memory } from "@src/types/memory";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  visible: boolean;
  onClose: () => void;
  memory: Memory;
  onUpdate: (frameId: number, slotId: number, data: Memory) => void;
  onSave: (frameId: number, slotId: number, data: Memory) => void;
  onDelete: (frameId: number, slotId: number) => void;
  frameItem: RoomItem | null;
  slotId: number | null;
  onFrameRemoved?: boolean;
  mode: "view" | "edit";
  memoryResolver: (frameId: number, slotId: number) => Memory | null;
};

const MemoryModal = ({
  visible,
  onClose,
  memory,
  onUpdate,
  onSave,
  onDelete,
  frameItem,
  slotId,
  onFrameRemoved,
  mode,
  memoryResolver,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const leftWidth = width * 0.6;
  const rightWidth = width * 0.4;

  const [selected, setSelected] = useState<number>(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(slotId);
  const selectedMemory =
    selectedSlotId != null && frameItem
      ? memoryResolver(frameItem.id, selectedSlotId)
      : null;
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [activeSlotId, setActiveSlotId] = useState<number | null>(null);

  // --- Animation setup (fade only) ---
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      });
      scale.value = withSpring(initialZoom, { damping: 15 });
      savedScale.value = initialZoom;
      translateX.value = 0;
      translateY.value = 0;
      savedX.value = 0;
      savedY.value = 0;
    } else {
      progress.value = withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.exp),
      });
    }
  }, [visible]);

  // --- Zoom / Pan gesture ---
  const initialZoom = 1.1;
  const scale = useSharedValue(initialZoom);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(initialZoom);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .onUpdate((e) => {
          scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
          savedScale.value = Math.min(Math.max(scale.value, 0.7), 2.5);
          scale.value = withSpring(savedScale.value, { damping: 15 });
        }),
    []
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((e) => {
          translateX.value = savedX.value + e.translationX;
          translateY.value = savedY.value + e.translationY;
        })
        .onEnd(() => {
          savedX.value = translateX.value;
          savedY.value = translateY.value;
        }),
    []
  );

  const composedGesture = useMemo(
    () => Gesture.Simultaneous(pinchGesture, panGesture),
    [pinchGesture, panGesture]
  );

  // --- Animated Styles ---
  const containerAnim = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const previewAnim = useAnimatedStyle(() => ({
    opacity: withDelay(
      10,
      withTiming(progress.value, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      })
    ),
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // --- Handlers ---
  const handleSlotPress = (slotId: number) => {
    if (!frameItem) return;
    const slotMemory = memoryResolver(frameItem.id, slotId);

    if (slotMemory) {
      // Slot đã có memory → mở MemoryModal
      setSelectedSlotId(slotId);
    } else {
      // Slot chưa có memory → mở AddMemoryModal
      openAddModal(slotId);
    }
  };

  const openAddModal = (slotId: number) => {
    setActiveSlotId(slotId);
    setIsOpenAddModal(true);
  };

  const closeAddModal = () => {
    setIsOpenAddModal(false);
  };

  const handleSave = (frameId: number, slotId: number, data: Memory) => {
    onSave(frameId, slotId, data);
    setIsOpenAddModal(false);
    setSelectedSlotId(slotId);
  };

  const handleClose = () => {
    progress.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  };

  const handleDelete = () => {
    if (frameItem && selectedSlotId != null) {
      setShowConfirm(false);
      onDelete(frameItem.id, selectedSlotId);
      handleClose();
    }
  };

  useEffect(() => {
    setSelected(1);
  }, [memory.id]);

  useEffect(() => {
    if (onFrameRemoved) handleClose();
  }, [onFrameRemoved]);

  useEffect(() => {
    if (visible) {
      setSelectedSlotId(slotId);
    }
  }, [visible, slotId]);

  if (!visible && progress.value === 0) return null;

  return (
    <Animated.View
      style={[styles.backdrop, containerAnim]}
      pointerEvents={visible ? "auto" : "none"}
    >
      <View style={[styles.modalContainer, { width, height }]}>
        {isLoading && <LoadingOverlay />}

        {/* LEFT: Frame Preview */}
        <View style={[styles.leftPane, { width: leftWidth }]}>
          {frameItem?.item && frameItem?.item.dimension && (
            <GestureDetector gesture={composedGesture}>
              <Animated.View
                style={[
                  styles.previewContainer,
                  previewAnim,
                  {
                    width: frameItem?.item.dimension.w ?? 0,
                    height: frameItem?.item.dimension.h ?? 0,
                  },
                ]}
              >
                <View
                  style={{
                    width: frameItem?.item.dimension.w ?? 0,
                    height: frameItem?.item.dimension.h ?? 0,
                  }}
                >
                  {frameItem?.item.slots
                    ?.slice()
                    .sort((a, b) => a.slotId - b.slotId)
                    .map((slot) => (
                      <Pressable
                        key={slot.slotId}
                        style={{ position: "absolute" }}
                        onPress={() => handleSlotPress(slot.slotId)}
                      >
                        <FrameView
                          slot={slot}
                          memory={memoryResolver(frameItem.id, slot.slotId)}
                        />
                      </Pressable>
                    ))}
                  <View style={styles.frameImage} pointerEvents="none">
                    <Image
                      source={{ uri: frameItem?.item.imageUrl }}
                      style={styles.frameImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </Animated.View>
            </GestureDetector>
          )}
        </View>

        {/* RIGHT: Memory Info */}
        <View style={[styles.rightPane, { width: rightWidth }]}>
          {mode === "edit" && (
            <ModalMenu
              modalWidth={rightWidth}
              selected={selected}
              setSelected={(id) => {
                if (id === 3) setShowConfirm(true);
                else setSelected(id);
              }}
            />
          )}

          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close-circle" size={30} color="#B0B0B0" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            {mode === "view" ? (
              selectedMemory && <InfoMemory memory={selectedMemory} />
            ) : (
              <>
                {selected === 1 && selectedMemory && (
                  <InfoMemory memory={selectedMemory} />
                )}
                {selected === 2 &&
                  frameItem &&
                  selectedSlotId != null &&
                  selectedMemory && (
                    <UpdateMemory
                      key={`${frameItem.id}-${selectedSlotId}`}
                      memory={selectedMemory}
                      frameItem={frameItem}
                      slotId={selectedSlotId}
                      onUpdate={(data) =>
                        onUpdate(frameItem.id, selectedSlotId, data)
                      }
                      onLoadingChange={setIsLoading}
                    />
                  )}
              </>
            )}
          </View>

          {mode === "edit" && showConfirm && (
            <ModalConfirm
              visible={showConfirm}
              mode="confirm"
              onClose={() => setShowConfirm(false)}
              onConfirm={handleDelete}
              titleText="Xác nhận xóa"
              contentText="Bạn có chắc chắn muốn xóa kỷ niệm này không?"
              icon={
                <MaterialIcons name="delete-forever" size={40} color="white" />
              }
              iconBgColor="#F75270"
              confirmBtnText="Xóa"
              confirmBtnColor="red"
              cancelBtnText="Hủy"
              cancelBtnColor="grey"
            />
          )}

          {mode === "edit" && isOpenAddModal && frameItem && (
            <AddMemoryModal
              visible={isOpenAddModal}
              onClose={closeAddModal}
              onSave={handleSave}
              frameId={frameItem.id}
              frameItem={frameItem}
              slotId={activeSlotId}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  modalContainer: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
  },
  leftPane: {
    alignItems: "center",
    justifyContent: "center",
  },
  previewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  frameImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "contain",
    backgroundColor: "transparent",
  },
  rightPane: {
    backgroundColor: "#fff",
    borderLeftWidth: 1,
    borderLeftColor: "#eee",
    paddingHorizontal: 16,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 10,
  },
});

export default MemoryModal;
