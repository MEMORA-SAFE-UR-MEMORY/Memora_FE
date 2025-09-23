// components/PlacedFrame.tsx
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { PlacedItem } from "@src/types/item";
import { Memory } from "@src/types/memory";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
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
  item: PlacedItem;
  onMove: (id: string, x: number, y: number) => void;
  onPress: () => void;
  onDelete: (id: string) => void;
  trashLayout?: { x: number; y: number; w: number; h: number } | null;
  setTrashActive: (active: boolean) => void;
  setShowTrash: (show: boolean) => void;
  memory?: Memory;
};

function clamp(val: number, min: number, max: number): number {
  "worklet";
  return Math.min(Math.max(val, min), max);
}

const FRAME_SIZE = 120;

const PlacedFrame = ({
  item,
  onMove,
  onPress,
  onDelete,
  trashLayout,
  setTrashActive,
  setShowTrash,
  memory,
}: PlacedFrameProps) => {
  const { width, height } = useWindowDimensions();

  // Tọa độ hiện tại
  const translationX = useSharedValue(item.x ?? 0);
  const translationY = useSharedValue(item.y ?? 0);

  // Giá trị tạm khi bắt đầu drag
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;

      runOnJS(setShowTrash)(true);
    })
    .onUpdate((event) => {
      const maxTranslateX = width - FRAME_SIZE;
      const maxTranslateY = height - FRAME_SIZE;

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

      // 👇 check hover vào trashZone
      const frameCenterX = translationX.value + FRAME_SIZE / 2;
      const frameCenterY = translationY.value + FRAME_SIZE / 2;

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
    })
    .onEnd(() => {
      const frameCenterX = translationX.value + FRAME_SIZE / 2;
      const frameCenterY = translationY.value + FRAME_SIZE / 2;

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
      runOnJS(setTrashActive)(false);
      runOnJS(setShowTrash)(false);
    });

  const handlePress = () => {
    onPress();
  };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, animatedStyles]}>
        <Image
          source={
            typeof item.frameUrl === "string"
              ? { uri: item.frameUrl }
              : item.frameUrl
          }
          style={styles.frameImage}
        />
        <Pressable onPress={handlePress} style={styles.contentArea}>
          {memory?.image ? (
            <Image
              source={{ uri: memory.image }}
              style={styles.memoryImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.emptyContent}>
              <MaterialCommunityIcons
                name="image-plus"
                size={20}
                color="#666"
              />
              <Text style={styles.emptyText}>Thêm kỷ niệm</Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: FRAME_SIZE,
    height: FRAME_SIZE,
  },
  frameImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  contentArea: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  memoryImage: {
    width: "100%",
    height: "100%",
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
