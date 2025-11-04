import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { FrameView } from "@src/components/FrameView";
import { RoomItem } from "@src/types/item";
import { Memory } from "@src/types/memory";
import React, { useEffect, useRef } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

type PlacedFrameProps = {
  item: RoomItem;
  onMove: (id: number, x: number, y: number) => void;
  onRotate: (id: number, rotation: number) => void;
  bringToFront: (id: number) => void;
  onPress: (frameId: number, slotId: number | null, frame: RoomItem) => void;
  onDelete: (id: number) => void;
  trashLayout?: { x: number; y: number; w: number; h: number } | null;
  setTrashActive: (active: boolean) => void;
  setShowTrash: (show: boolean) => void;
  roomWidth?: number;
  roomHeight?: number;
  memoryResolver: (frameId: number, slotId: number) => Memory | null;
  scrollX: SharedValue<number>;
  mode: "view" | "edit";
  isEditing: boolean;
  enterEditMode: () => void;
  onUserInteractionStart: () => void;
  onUserInteractionEnd: () => void;
};

function clamp(val: number, min: number, max: number): number {
  "worklet";
  return Math.min(Math.max(val, min), max);
}

const PlacedFrame = ({
  item,
  onMove,
  onRotate,
  bringToFront,
  onPress,
  onDelete,
  trashLayout,
  setTrashActive,
  setShowTrash,
  roomWidth,
  roomHeight,
  memoryResolver,
  scrollX,
  mode,
  isEditing,
  enterEditMode,
  onUserInteractionEnd,
  onUserInteractionStart,
}: PlacedFrameProps) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const maxWidth = roomWidth || screenWidth;
  const maxHeight = roomHeight || screenHeight;

  const translationX = useSharedValue(item.x ?? 0);
  const translationY = useSharedValue(item.y ?? 0);
  const rotation = useSharedValue(item.rotation ?? 0);

  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const startAngle = useSharedValue(0);
  const startRotation = useSharedValue(0);

  const isOnRotateIcon = useSharedValue(false);
  const isRotating = useSharedValue(false);
  const isTwoFingerActive = useSharedValue(false);

  const trashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTrashDisabled = useRef(false);

  const fade = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: withTiming(fade.value, { duration: 300 }),
  }));

  const borderHighlight = useAnimatedStyle(() => {
    const active = isRotating.value || isTwoFingerActive.value;
    return {
      borderColor: withTiming(active ? "#A855F7" : "#E9D8FF", {
        duration: 150,
      }),
      shadowColor: "#A855F7",
      shadowOpacity: withTiming(active ? 0.7 : 0, { duration: 150 }),
      shadowRadius: withTiming(active ? 12 : 0, { duration: 150 }),
      shadowOffset: { width: 0, height: 0 },
    };
  });

  // Gesture xoay bằng icon (ưu tiên cao nhất)
  const iconRotate = Gesture.Pan()
    .enabled(isEditing && item.item.categoryId !== 1)
    .onTouchesDown((event, manager) => {
      const touch = event.allTouches?.[0];
      if (!touch) return;

      const iconCenterX = item.item.dimension.w / 2;
      const iconCenterY = -50 + 20;
      const radius = 25;
      const dx = touch.x - iconCenterX;
      const dy = touch.y - iconCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > radius) {
        manager.fail();
        return;
      }
      isRotating.value = true;
    })
    .onStart((event) => {
      isRotating.value = true;
      runOnJS(onUserInteractionStart)();
      const centerX = item.item.dimension.w / 2;
      const centerY = item.item.dimension.h / 2;
      const dx = event.x - centerX;
      const dy = event.y - centerY;
      startAngle.value = Math.atan2(dy, dx);
      startRotation.value = rotation.value;
      runOnJS(bringToFront)(item.id);
    })
    .onUpdate((event) => {
      const centerX = item.item.dimension.w / 2;
      const centerY = item.item.dimension.h / 2;
      const dx = event.x - centerX;
      const dy = event.y - centerY;
      const currentAngle = Math.atan2(dy, dx);
      const delta = currentAngle - startAngle.value;
      rotation.value = startRotation.value + delta;
    })
    .onEnd(() => {
      isRotating.value = false;
      runOnJS(onRotate)(item.id, rotation.value);
      runOnJS(onUserInteractionEnd)();
    });

  // Gesture di chuyển item
  const panMove = Gesture.Pan()
    .enabled(isEditing)
    .minDistance(5)
    .onStart((event) => {
      const iconCenterX = item.item.dimension.w / 2;
      const iconCenterY = -50 + 20;
      const radius = 20;
      const dx = event.x - iconCenterX;
      const dy = event.y - iconCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // ✅ Kiểm tra chính xác khu vực icon xoay
      if (distance <= radius) {
        // bắt đầu xoay
        isOnRotateIcon.value = true;
        runOnJS(onUserInteractionStart)();

        const centerX = item.item.dimension.w / 2;
        const centerY = item.item.dimension.h / 2;
        const dx2 = event.x - centerX;
        const dy2 = event.y - centerY;
        startAngle.value = Math.atan2(dy2, dx2);
        startRotation.value = rotation.value;

        runOnJS(bringToFront)(item.id);
        return;
      }

      // Nếu không bấm vào icon xoay → chuẩn bị di chuyển
      isOnRotateIcon.value = false;
      runOnJS(onUserInteractionStart)();
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
      runOnJS(setShowTrash)(true);
      runOnJS(bringToFront)(item.id);
    })
    .onUpdate((event) => {
      // Nếu đang xoay thì không di chuyển
      if (isOnRotateIcon.value) {
        isRotating.value = true;
        const centerX = item.item.dimension.w / 2;
        const centerY = item.item.dimension.h / 2;
        const dx = event.x - centerX;
        const dy = event.y - centerY;
        const currentAngle = Math.atan2(dy, dx);
        const delta = currentAngle - startAngle.value;
        rotation.value = startRotation.value + delta;
        return;
      }

      // Nếu không xoay → di chuyển
      const maxTranslateX = maxWidth - item.item.dimension.w;
      const maxTranslateY = maxHeight - item.item.dimension.h;

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        0,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        0,
        maxTranslateY
      );

      const frameCenterX =
        translationX.value - scrollX.value + item.item.dimension.w / 2;
      const frameCenterY = translationY.value + item.item.dimension.h / 2;

      if (
        trashLayout &&
        frameCenterX > trashLayout.x &&
        frameCenterX < trashLayout.x + trashLayout.w &&
        frameCenterY > trashLayout.y &&
        frameCenterY < trashLayout.y + trashLayout.h
      ) {
        runOnJS(setTrashActive)(true);

        if (!trashTimeoutRef.current) {
          trashTimeoutRef.current = setTimeout(() => {
            runOnJS(setShowTrash)(false);
            runOnJS(setTrashActive)(false);
            isTrashDisabled.current = true;
            trashTimeoutRef.current = null;
          }, 1000);
        }
      } else {
        runOnJS(setTrashActive)(false);

        if (trashTimeoutRef.current) {
          clearTimeout(trashTimeoutRef.current);
          trashTimeoutRef.current = null;
        }
      }
    })
    .onEnd(() => {
      if (isOnRotateIcon.value) {
        // kết thúc xoay
        isRotating.value = false;
        runOnJS(onRotate)(item.id, rotation.value);
        runOnJS(onUserInteractionEnd)();
        isOnRotateIcon.value = false;
        return;
      }

      const frameCenterX =
        translationX.value - scrollX.value + item.item.dimension.w / 2;
      const frameCenterY = translationY.value + item.item.dimension.h / 2;

      if (
        !isTrashDisabled.current &&
        trashLayout &&
        frameCenterX > trashLayout.x &&
        frameCenterX < trashLayout.x + trashLayout.w &&
        frameCenterY > trashLayout.y &&
        frameCenterY < trashLayout.y + trashLayout.h
      ) {
        runOnJS(onDelete)(item.id);
        runOnJS(setTrashActive)(false);
        runOnJS(setShowTrash)(false);
        runOnJS(onUserInteractionEnd)();
        return;
      }

      runOnJS(onMove)(item.id, translationX.value, translationY.value);
      runOnJS(setTrashActive)(false);
      runOnJS(setShowTrash)(false);
      runOnJS(onUserInteractionEnd)();
      isTrashDisabled.current = false;
    });

  const twoFingerRotate = Gesture.Rotation()
    .enabled(isEditing && item.item.categoryId !== 1)
    .onTouchesDown((event) => {
      const touches = event.allTouches?.length ?? 0;
      if (touches === 2) {
        isTwoFingerActive.value = true;
      }
    })
    .onTouchesMove((event) => {
      const touches = event.allTouches?.length ?? 0;
      // Nếu rời ngón hoặc thêm ngón → tắt hiệu ứng
      isTwoFingerActive.value = touches === 2;
    })
    .onStart(() => {
      isRotating.value = true;
      runOnJS(bringToFront)(item.id);
      runOnJS(onUserInteractionStart)();
    })
    .onUpdate((event) => {
      rotation.value = (item.rotation ?? 0) + event.rotation;
    })
    .onTouchesUp((event) => {
      const touches = event.allTouches?.length ?? 0;
      if (touches < 2) {
        isTwoFingerActive.value = false;
      }
    })
    .onEnd(() => {
      isRotating.value = false;
      isTwoFingerActive.value = false; // chắc chắn tắt
      runOnJS(onRotate)(item.id, rotation.value);
      runOnJS(onUserInteractionEnd)();
    });

  const composed = Gesture.Simultaneous(
    Gesture.Exclusive(iconRotate, panMove),
    twoFingerRotate
  );

  const handleLongPress = () => {
    enterEditMode();
  };

  const handlePress = () => {
    onPress(item.id, null, item);
  };

  useEffect(() => {
    translationX.value = item.x ?? 0;
    translationY.value = item.y ?? 0;
    rotation.value = item.rotation ?? 0;
  }, [item.x, item.y, item.rotation]);

  useEffect(() => {
    if (item.item.categoryId === 1) {
      fade.value = 0;
      fade.value = withDelay(100, withTiming(1, { duration: 400 }));
    } else {
      fade.value = 1;
    }
  }, [item.item.categoryId]);

  if (mode === "view") {
    return (
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          {
            width: item.item.dimension.w,
            height: item.item.dimension.h,
            zIndex: item.zIndex,
          },
        ]}
      >
        {item.item.categoryId !== 1 ? (
          <Pressable style={{ flex: 1 }}>
            <Image
              source={{ uri: item.item.imageUrl }}
              style={styles.itemImage}
              resizeMode="contain"
            />
          </Pressable>
        ) : (
          <Animated.View style={[styles.contentArea, fadeStyle]}>
            {item.item.slots
              ?.slice()
              .sort((a, b) => a.slotId - b.slotId)
              .map((slot) => (
                <Pressable
                  key={slot.slotId}
                  style={{ position: "absolute" }}
                  onPress={() => onPress(item.id, slot.slotId, item)}
                >
                  <FrameView
                    slot={slot}
                    memory={memoryResolver(item.id, slot.slotId)}
                  />
                </Pressable>
              ))}
            <View style={styles.frameImage} pointerEvents="none">
              <Image
                source={{ uri: item.item.imageUrl }}
                style={styles.frameImage}
                resizeMode="contain"
              />
            </View>
          </Animated.View>
        )}
      </Animated.View>
    );
  }

  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          {
            width: item.item.dimension.w,
            height: item.item.dimension.h,
            zIndex: item.zIndex,
          },
        ]}
      >
        {item.item.categoryId !== 1 ? (
          <>
            {isEditing && (
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    left: -10,
                    top: -10,
                    right: -10,
                    bottom: -10,
                    borderWidth: 2,
                    borderRadius: 8,
                    backgroundColor: "rgba(159,122,234,0.1)",
                    zIndex: 1,
                  },
                  borderHighlight,
                ]}
                pointerEvents="none"
              />
            )}
            {isEditing && (
              <View style={styles.rotateIcon} pointerEvents="box-none">
                <FontAwesome6 name="arrows-rotate" size={20} color="white" />
              </View>
            )}
            <Pressable
              onPress={handlePress}
              onLongPress={handleLongPress}
              delayLongPress={300}
              style={{ flex: 1 }}
            >
              <Image
                source={{ uri: item.item.imageUrl }}
                style={[styles.itemImage]}
                resizeMode="contain"
              />
            </Pressable>
          </>
        ) : (
          <Animated.View style={[styles.contentArea, fadeStyle]}>
            <Pressable
              onLongPress={handleLongPress}
              delayLongPress={300}
              style={styles.contentArea}
            >
              {isEditing && (
                <View
                  style={{
                    position: "absolute",
                    left: -10,
                    top: -10,
                    right: -10,
                    bottom: -10,
                    borderWidth: 2,
                    borderColor: "#E9D8FF",
                    backgroundColor: "rgba(159,122,234,0.1)",
                    borderRadius: 8,
                    zIndex: 1,
                  }}
                  pointerEvents="none"
                />
              )}
              {item.item.slots
                ?.slice()
                .sort((a, b) => a.slotId - b.slotId)
                .map((slot) => (
                  <Pressable
                    key={slot.slotId}
                    style={{ position: "absolute" }}
                    onPress={() => onPress(item.id, slot.slotId, item)}
                    onLongPress={enterEditMode}
                    delayLongPress={300}
                  >
                    <FrameView
                      slot={slot}
                      memory={memoryResolver(item.id, slot.slotId)}
                    />
                  </Pressable>
                ))}
              <View style={styles.frameImage} pointerEvents="none">
                <Image
                  source={{ uri: item.item.imageUrl }}
                  style={styles.frameImage}
                  resizeMode="contain"
                />
              </View>
            </Pressable>
          </Animated.View>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "transparent",
  },
  frameImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "transparent",
  },
  rotateIcon: {
    position: "absolute",
    top: -50,
    left: "50%",
    transform: [{ translateX: -12 }],
    backgroundColor: "#E9D8FF",
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: "#D6B7FF",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 2,
  },
  contentArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "visible",
  },
});

export default PlacedFrame;
