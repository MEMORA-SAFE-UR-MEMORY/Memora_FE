import { MaterialIcons } from "@expo/vector-icons";
import BtnBorder from "@src/components/BtnBorder";
import { FrameSlot } from "@src/types/frame";
import { getCropShape } from "@src/utils/cropShape";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, Mask, Rect } from "react-native-svg";

type Props = {
  visible: boolean;
  imageUri: string;
  slot: FrameSlot;
  imgSize: { imgW: number; imgH: number };
  onConfirm: (croppedUri: string) => void;
  onCancel: () => void;
};

const ImageCropModal: React.FC<Props> = ({
  visible,
  imageUri,
  slot,
  imgSize,
  onConfirm,
  onCancel,
}) => {
  const { width, height } = useWindowDimensions();
  const viewRef = useRef<View>(null);
  const cropShape = getCropShape(slot);

  // Shared values for image transform
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const [minScale, setMinScale] = useState(1);
  const [maxScale, setMaxScale] = useState(4);
  const [imageSize, setImageSize] = useState({ w: width, h: height });

  // Tính kích thước vùng crop
  let cropW = width * 0.7;
  let cropH = height * 0.6;

  if (cropShape.type === "rect" && cropShape.w && cropShape.h) {
    const ratio = cropShape.w / cropShape.h;
    if (ratio > 1) {
      cropW = width * 0.7;
      cropH = cropW / ratio;
    } else {
      cropH = height * 0.5;
      cropW = cropH * ratio;
    }
  }

  if (cropShape.type === "circle") {
    const size = Math.min(width, height) * 0.55;
    cropW = size;
    cropH = size;
  }

  const cropCenterX = width / 2;
  const cropCenterY = height / 2;

  // Tính kích thước ảnh hiển thị thực tế
  useEffect(() => {
    if (!imageUri || !imgSize?.imgW || !imgSize?.imgH) return;
    const { imgW, imgH } = imgSize;
    const ratio = imgW / imgH;
    let displayW = width;
    let displayH = width / ratio;

    if (displayH > height) {
      displayH = height;
      displayW = height * ratio;
    }

    setImageSize({ w: displayW, h: displayH });

    // Fit ảnh với crop ban đầu
    const fitScale = Math.max(cropW / displayW, cropH / displayH);
    setMinScale(fitScale);
    setMaxScale(fitScale * 3);
    scale.value = fitScale;
  }, [imageUri, imgSize]);

  // Pan gesture
  const pan = Gesture.Pan().onChange((e) => {
    translateX.value += e.changeX;
    translateY.value += e.changeY;

    const maxX = Math.max(0, (imageSize.w * scale.value - cropW) / 2);
    const maxY = Math.max(0, (imageSize.h * scale.value - cropH) / 2);

    translateX.value = Math.max(-maxX, Math.min(translateX.value, maxX));
    translateY.value = Math.max(-maxY, Math.min(translateY.value, maxY));
  });

  // Pinch gesture
  const pinch = Gesture.Pinch()
    .onChange((e) => {
      if (e.numberOfPointers < 2) return;
      const nextScale = scale.value * e.scaleChange;
      scale.value = Math.min(Math.max(nextScale, minScale), maxScale);

      const maxX = Math.max(0, (imageSize.w * scale.value - cropW) / 2);
      const maxY = Math.max(0, (imageSize.h * scale.value - cropH) / 2);

      translateX.value = Math.max(-maxX, Math.min(translateX.value, maxX));
      translateY.value = Math.max(-maxY, Math.min(translateY.value, maxY));
    })
    .onEnd(() => {
      if (scale.value < minScale) scale.value = minScale;
      if (scale.value > maxScale) scale.value = maxScale;
    });

  const composed = Gesture.Simultaneous(pan, pinch);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleCrop = async () => {
    try {
      if (!imgSize || !imgSize.imgW || !imgSize.imgH) {
        console.warn("Kích thước ảnh gốc chưa sẵn sàng:", imgSize);
        return;
      }

      const { imgW: imgOrigW, imgH: imgOrigH } = imgSize;
      const { w: displayW, h: displayH } = imageSize;
      const cropX = (width - cropW) / 2;
      const cropY = (height - cropH) / 2;

      // Tính tâm ảnh sau pan
      const centerX = width / 2 + translateX.value;
      const centerY = height / 2 + translateY.value;
      const renderedW = displayW * scale.value;
      const renderedH = displayH * scale.value;

      // Vị trí ảnh trên màn hình
      const imageLeft = centerX - renderedW / 2;
      const imageTop = centerY - renderedH / 2;

      // Tính phần crop tương đối trong ảnh gốc
      const cropInImageX = ((cropX - imageLeft) / renderedW) * imgOrigW;
      const cropInImageY = ((cropY - imageTop) / renderedH) * imgOrigH;
      const cropInImageW = (cropW / renderedW) * imgOrigW;
      const cropInImageH = (cropH / renderedH) * imgOrigH;

      const finalCropX = Math.max(0, cropInImageX);
      const finalCropY = Math.max(0, cropInImageY);
      const finalCropW = Math.min(cropInImageW, imgOrigW - finalCropX);
      const finalCropH = Math.min(cropInImageH, imgOrigH - finalCropY);

      const cropped = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: finalCropX,
              originY: finalCropY,
              width: finalCropW,
              height: finalCropH,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      onConfirm(cropped.uri);
    } catch (error) {
      console.error("Lỗi crop ảnh:", error);
    }
  };

  const handleReset = () => {
    translateX.value = 0;
    translateY.value = 0;
    scale.value = minScale;
  };

  // Animated
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    pointerEvents: visible ? "auto" : "none", // tránh bấm khi ẩn
  }));

  if (!visible && opacity.value === 0) return null;

  if (!slot?.shape) return null;

  return (
    <Animated.View style={[styles.overlay, animatedStyle]}>
      <GestureHandlerRootView style={[styles.container, { width, height }]}>
        <View style={[styles.container, { width, height }]}>
          {/* Image container */}
          <GestureDetector gesture={composed}>
            <View style={[StyleSheet.absoluteFill, { zIndex: 1 }]}>
              <Animated.View
                ref={viewRef}
                collapsable={false}
                style={[StyleSheet.absoluteFill, imageStyle, { zIndex: 0 }]}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={{
                    width: imageSize.w,
                    height: imageSize.h,
                    position: "absolute",
                    left: (width - imageSize.w) / 2,
                    top: (height - imageSize.h) / 2,
                  }}
                  resizeMode="contain"
                />
              </Animated.View>

              {/* Overlay mask */}
              <View pointerEvents="none">
                <Svg
                  height={height}
                  width={width}
                  style={StyleSheet.absoluteFill}
                >
                  <Defs>
                    <Mask id="cropMask">
                      <Rect width="100%" height="100%" fill="white" />
                      {cropShape.type === "circle" ? (
                        <Circle
                          cx={cropCenterX}
                          cy={cropCenterY}
                          r={cropW / 2}
                          fill="black"
                        />
                      ) : (
                        <Rect
                          x={cropCenterX - cropW / 2}
                          y={cropCenterY - cropH / 2}
                          width={cropW}
                          height={cropH}
                          fill="black"
                        />
                      )}
                    </Mask>
                  </Defs>

                  <Rect
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.7)"
                    mask="url(#cropMask)"
                  />
                </Svg>

                {/* Crop frame border */}
                <View
                  style={[
                    styles.cropFrame,
                    {
                      width: cropW,
                      height: cropH,
                      borderRadius: cropShape.type === "circle" ? cropW / 2 : 0,
                      left: cropCenterX - cropW / 2,
                      top: cropCenterY - cropH / 2,
                    },
                  ]}
                />

                {/* Grid lines */}
                {cropShape.type === "rect" && (
                  <>
                    <View
                      style={[
                        styles.gridLine,
                        {
                          left: cropCenterX - cropW / 2 + cropW / 3,
                          top: cropCenterY - cropH / 2,
                          height: cropH,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.gridLine,
                        {
                          left: cropCenterX - cropW / 2 + (cropW * 2) / 3,
                          top: cropCenterY - cropH / 2,
                          height: cropH,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.gridLineHorizontal,
                        {
                          top: cropCenterY - cropH / 2 + cropH / 3,
                          left: cropCenterX - cropW / 2,
                          width: cropW,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.gridLineHorizontal,
                        {
                          top: cropCenterY - cropH / 2 + (cropH * 2) / 3,
                          left: cropCenterX - cropW / 2,
                          width: cropW,
                        },
                      ]}
                    />
                  </>
                )}
              </View>
            </View>
          </GestureDetector>

          {/* Overlay mask */}
          <View
            style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
            pointerEvents="none"
          >
            <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
              <Defs>
                <Mask id="cropMask">
                  <Rect width="100%" height="100%" fill="white" />
                  {cropShape.type === "circle" ? (
                    <Circle
                      cx={cropCenterX}
                      cy={cropCenterY}
                      r={cropW / 2}
                      fill="black"
                    />
                  ) : (
                    <Rect
                      x={cropCenterX - cropW / 2}
                      y={cropCenterY - cropH / 2}
                      width={cropW}
                      height={cropH}
                      fill="black"
                    />
                  )}
                </Mask>
              </Defs>

              <Rect
                width="100%"
                height="100%"
                fill="rgba(0,0,0,0.7)"
                mask="url(#cropMask)"
              />
            </Svg>

            {/* Crop frame border */}
            <View
              style={[
                styles.cropFrame,
                {
                  width: cropW,
                  height: cropH,
                  borderRadius: cropShape.type === "circle" ? cropW / 2 : 0,
                  left: cropCenterX - cropW / 2,
                  top: cropCenterY - cropH / 2,
                },
              ]}
            />

            {/* Grid lines */}
            {cropShape.type === "rect" && (
              <>
                <View
                  style={[
                    styles.gridLine,
                    {
                      left: cropCenterX - cropW / 2 + cropW / 3,
                      top: cropCenterY - cropH / 2,
                      height: cropH,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.gridLine,
                    {
                      left: cropCenterX - cropW / 2 + (cropW * 2) / 3,
                      top: cropCenterY - cropH / 2,
                      height: cropH,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.gridLineHorizontal,
                    {
                      top: cropCenterY - cropH / 2 + cropH / 3,
                      left: cropCenterX - cropW / 2,
                      width: cropW,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.gridLineHorizontal,
                    {
                      top: cropCenterY - cropH / 2 + (cropH * 2) / 3,
                      left: cropCenterX - cropW / 2,
                      width: cropW,
                    },
                  ]}
                />
              </>
            )}
          </View>

          {/* === TOP TOOLBAR === */}
          <View style={styles.topToolbar}>
            <TouchableOpacity onPress={handleReset} style={styles.toolButton}>
              <MaterialIcons name="refresh" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* === Bottom buttons === */}
          <View style={styles.bottomToolbar}>
            <View style={styles.bottomButtons}>
              <BtnBorder text="Hủy" colorType="grey" onPress={onCancel} />
              <BtnBorder
                text="Xác nhận"
                colorType="blue"
                onPress={handleCrop}
              />
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
  },
  cropFrame: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#fff",
  },
  gridLine: {
    position: "absolute",
    width: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  gridLineHorizontal: {
    position: "absolute",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  topToolbar: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    zIndex: 20,
  },
  bottomToolbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: 12,
  },
  toolButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomButtons: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 20,
    justifyContent: "space-around",
  },
});

export default ImageCropModal;
