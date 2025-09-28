import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { FrameView } from "@src/components/FrameView";
import { RoomItem } from "@src/types/item";
import { Memory } from "@src/types/memory";
import React, { useEffect, useState } from "react";
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
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type PlacedFrameProps = {
  item: RoomItem;
  onMove: (id: number, x: number, y: number) => void;
  onRotate: (id: number, rotation: number) => void;
  bringToFront: (id: number) => void;
  onPress: () => void;
  onDelete: (id: number) => void;
  trashLayout?: { x: number; y: number; w: number; h: number } | null;
  setTrashActive: (active: boolean) => void;
  setShowTrash: (show: boolean) => void;
  roomWidth?: number;
  roomHeight?: number;
  memory?: Memory;
  scrollX: number;
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
  memory,
  scrollX,
}: PlacedFrameProps) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const maxWidth = roomWidth || screenWidth;
  const maxHeight = roomHeight || screenHeight;

  const translationX = useSharedValue(item.x ?? 0);
  const translationY = useSharedValue(item.y ?? 0);
  const rotation = useSharedValue(item.rotation ?? 0);

  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const isRotatingByIcon = useSharedValue(false);
  const startAngle = useSharedValue(0);
  const startRotation = useSharedValue(0);

  const [showRotateIcon, setShowRotateIcon] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (showRotateIcon && !isRotating) {
      timer = setTimeout(() => {
        setShowRotateIcon(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showRotateIcon, isRotating]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  // Pan gesture (move hoặc kéo icon để xoay)
  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart((event) => {
      // check nếu bấm vào icon rotate
      const touchX = event.x;
      const touchY = event.y;
      const iconX = item.item.dimension.w - 24; // icon nằm góc phải trên
      const iconY = 0;

      if (
        item.item.categoryId !== 1 &&
        showRotateIcon &&
        touchX >= iconX - 30 &&
        touchX <= iconX + 30 &&
        touchY >= iconY - 30 &&
        touchY <= iconY + 30
      ) {
        isRotatingByIcon.value = true;
        runOnJS(setIsRotating)(true);

        const centerX = item.item.dimension.w / 2;
        const centerY = item.item.dimension.h / 2;
        const dx = event.x - centerX;
        const dy = event.y - centerY;
        startAngle.value = Math.atan2(dy, dx);
        startRotation.value = rotation.value;
      } else {
        isRotatingByIcon.value = false;
        prevTranslationX.value = translationX.value;
        prevTranslationY.value = translationY.value;
      }

      runOnJS(setShowTrash)(true);
      runOnJS(bringToFront)(item.id);
    })
    .onUpdate((event) => {
      if (isRotatingByIcon.value) {
        const centerX = item.item.dimension.w / 2;
        const centerY = item.item.dimension.h / 2;
        const dx = event.x - centerX;
        const dy = event.y - centerY;
        const currentAngle = Math.atan2(dy, dx);

        // Chênh lệch góc so với ban đầu
        const delta = currentAngle - startAngle.value;
        rotation.value = startRotation.value + delta;
      } else {
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
          translationX.value - scrollX + item.item.dimension.w / 2;
        const frameCenterY = translationY.value + item.item.dimension.h / 2;

        if (
          trashLayout &&
          frameCenterX > trashLayout.x &&
          frameCenterX < trashLayout.x + trashLayout.w &&
          frameCenterY > trashLayout.y &&
          frameCenterY < trashLayout.y + trashLayout.h
        ) {
          runOnJS(setTrashActive)(true);
        } else {
          runOnJS(setTrashActive)(false);
        }
      }
    })
    .onEnd(() => {
      if (isRotatingByIcon.value) {
        runOnJS(onRotate)(item.id, rotation.value);
        runOnJS(setIsRotating)(false);
      } else {
        const frameCenterX =
          translationX.value - scrollX + item.item.dimension.w / 2;
        const frameCenterY = translationY.value + item.item.dimension.h / 2;

        if (
          trashLayout &&
          frameCenterX > trashLayout.x &&
          frameCenterX < trashLayout.x + trashLayout.w &&
          frameCenterY > trashLayout.y &&
          frameCenterY < trashLayout.y + trashLayout.h
        ) {
          runOnJS(onDelete)(item.id);
          runOnJS(setTrashActive)(false);
          runOnJS(setShowTrash)(false);
          return;
        }

        runOnJS(onMove)(item.id, translationX.value, translationY.value);
      }
      runOnJS(setTrashActive)(false);
      runOnJS(setShowTrash)(false);
    });

  // Rotation gesture (xoay bằng 2 ngón)
  const rotate = Gesture.Rotation()
    .onUpdate((event) => {
      if (item.item.categoryId !== 1) {
        rotation.value = (item.rotation ?? 0) + event.rotation;
      }
    })
    .onEnd(() => {
      if (item.item.categoryId !== 1) {
        runOnJS(onRotate)(item.id, rotation.value);
      }
    });

  const composed = Gesture.Simultaneous(pan, rotate);

  const handlePress = () => {
    if (item.item.categoryId !== 1) {
      setShowRotateIcon((prev) => !prev);
    } else {
      onPress();
    }
  };

  useEffect(() => {
    translationX.value = item.x ?? 0;
    translationY.value = item.y ?? 0;
    rotation.value = item.rotation ?? 0;
  }, [item.x, item.y, item.rotation]);

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
        {item.item.type === "decor" ? (
          <>
            {showRotateIcon && (
              <View style={styles.rotateIcon}>
                <FontAwesome6 name="arrows-rotate" size={20} color="white" />
              </View>
            )}
            <Pressable onPress={handlePress} style={{ flex: 1 }}>
              <Image
                source={item.item.imageUrl}
                style={[styles.itemImage]}
                resizeMode="contain"
              />
            </Pressable>
          </>
        ) : (
          <>
            <Pressable onPress={handlePress} style={styles.contentArea}>
              {item.item.slots?.map((slot) => (
                <FrameView
                  key={slot.slotId}
                  slot={slot}
                  memory={memory} // sau này có thể đổi thành item.slotMemories?.[slot.slotId]
                  frameWidth={item.item.dimension.w}
                  frameHeight={item.item.dimension.h}
                />
              ))}
              <Image
                source={item.item.imageUrl}
                style={styles.frameImage}
                resizeMode="contain"
              />
            </Pressable>
          </>
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
  },
  frameImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  memoryImage: {
    width: "100%",
    height: "100%",
  },
  rotateIcon: {
    position: "absolute",
    top: -36,
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
  },
  contentArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emptyContent: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  emptyText: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    marginTop: 2,
    fontFamily: "Baloo2_medium",
  },
});

export default PlacedFrame;
