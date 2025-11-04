import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FrameSlot } from "@src/types/frame";
import { Memory } from "@src/types/memory";
import { getRenderSize } from "@src/utils/renderScale";
import { renderShape } from "@src/utils/renderShape";
import { useEffect, useState } from "react";
import { Image, useWindowDimensions, View } from "react-native";
import { ClipPath, Defs, Svg, Image as SvgImage, Text } from "react-native-svg";

type FrameViewProps = {
  slot: FrameSlot;
  memory?: Memory | null;
  mode: "view" | "edit";
};

export function FrameView({ slot, memory, mode }: FrameViewProps) {
  const [isLoading, setIsLoading] = useState(false);

  const clipId = `clip-${slot.slotId}`;

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  // Room dimensions - 3x wider than screen
  const roomWidth = screenWidth * 3;
  const roomHeight = screenHeight;

  // Tính kích thước và vị trí
  const { width, height } = getRenderSize({
    xRatio: slot.x / roomWidth,
    yRatio: slot.y / roomHeight,
    wRatio: slot.w / roomWidth,
    hRatio: slot.h / roomHeight,
  });

  // Tính vị trí trung tâm của slot
  const centerX = width / 2;
  const centerY = height / 2;

  const showText = width > 60 && height > 60;

  const rotation = slot.rotation ?? 0;

  useEffect(() => {
    if (memory?.image) {
      setIsLoading(true);
      Image.prefetch(memory.image)
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [memory?.image]);

  return (
    <View
      style={{
        width,
        height,
        transform: [{ rotate: `${rotation}deg` }],
        zIndex: slot.slotId,
      }}
      pointerEvents="box-none"
    >
      <Svg width="100%" height="100%" pointerEvents="none">
        <Defs>
          <ClipPath id={clipId}>{renderShape(slot)}</ClipPath>
        </Defs>

        {memory?.image && !isLoading ? (
          // --- Ảnh đã tải xong ---
          <SvgImage
            width="100%"
            height="100%"
            href={{ uri: memory.image }}
            clipPath={`url(#${clipId})`}
            preserveAspectRatio="xMidYMid slice"
          />
        ) : isLoading ? (
          // --- Đang tải ảnh ---
          <>
            {renderShape(slot, { fill: "#e0e0e0" })}

            <View
              style={{
                position: "absolute",
                top: centerY - (showText ? 19 : 8),
                left: centerX - 10,
              }}
            >
              <MaterialCommunityIcons
                name="image-refresh"
                size={20}
                color="#999"
              />
            </View>
            {showText && (
              <Text
                fill="#999"
                fontSize="10"
                x={centerX}
                y={centerY + 18}
                fontFamily="Baloo2_medium"
                textAnchor="middle"
              >
                Đang tải ảnh...
              </Text>
            )}
          </>
        ) : (
          // --- Không có hình ảnh ---
          <>
            {/* Nền khung xám */}
            {renderShape(slot, { fill: "#f0f0f0" })}

            {mode === "edit" ? (
              <>
                {/* Icon thêm kỷ niệm */}
                <View
                  style={{
                    position: "absolute",
                    top: centerY - (showText ? 19 : 8),
                    left: centerX - 10,
                  }}
                >
                  <MaterialCommunityIcons
                    name="image-plus"
                    size={20}
                    color="#999"
                  />
                </View>

                {showText && (
                  <Text
                    fill="#999"
                    fontSize="10"
                    x={centerX}
                    y={centerY + 18}
                    fontFamily="Baloo2_medium"
                    textAnchor="middle"
                  >
                    Thêm kỷ niệm
                  </Text>
                )}
              </>
            ) : (
              <>
                <View
                  style={{
                    position: "absolute",
                    top: centerY - (showText ? 19 : 8),
                    left: centerX - 10,
                  }}
                >
                  <MaterialCommunityIcons
                    name="image-off"
                    size={20}
                    color="#999"
                  />
                </View>
                {showText && (
                  <Text
                    fill="#999"
                    fontSize="10"
                    x={centerX}
                    y={centerY + 18}
                    fontFamily="Baloo2_medium"
                    textAnchor="middle"
                  >
                    Chưa có kỷ niệm
                  </Text>
                )}
              </>
            )}
          </>
        )}
      </Svg>
    </View>
  );
}
