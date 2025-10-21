import { FrameSlot } from "@src/types/frame";
import { Memory } from "@src/types/memory";
import { renderShape } from "@src/utils/renderShape";
import { View } from "react-native";
import {
  ClipPath,
  Defs,
  Path,
  Svg,
  Image as SvgImage,
  Text,
} from "react-native-svg";

type FrameViewProps = {
  slot: FrameSlot;
  memory?: Memory | null;
};

export function FrameView({
  slot,
  memory,
}: FrameViewProps) {
  const clipId = `clip-${slot.slotId}`;

  // Tính tỷ lệ (scale) dựa trên kích thước khung
  const baseSize = 100; // kích thước chuẩn để tham chiếu
  const scaleFactor = Math.min(slot.w, slot.h) / baseSize;

  // Tính vị trí trung tâm của slot
  const centerX = slot.w / 2;
  const centerY = slot.h / 2;

  const showText = slot.w > 60 && slot.h > 60;

  const rotation = slot.rotation ?? 0;

  return (
    <View
      style={{
        position: "absolute",
        top: slot.y,
        left: slot.x,
        width: slot.w,
        height: slot.h,
        transform: [{ rotate: `${rotation}deg` }],
      }}
    >
      <Svg width="100%" height="100%">
        <Defs>
          <ClipPath id={clipId}>{renderShape(slot)}</ClipPath>
        </Defs>

        {memory?.image ? (
          <SvgImage
            width="100%"
            height="100%"
            href={{ uri: memory.image }}
            clipPath={`url(#${clipId})`}
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          <>
            {renderShape(slot, { fill: "#f0f0f0" })}

            <Path
              d="M18 15V18H15V20H18V23H20V20H23V18H20V15H18M13.3 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V13.3C20.4 13.1 19.7 13 19 13C17.9 13 16.8 13.3 15.9 13.9L14.5 12L11 16.5L8.5 13.5L5 18H13.1C13 18.3 13 18.7 13 19C13 19.7 13.1 20.4 13.3 21Z"
              fill="#666"
              scale={scaleFactor * 1.2}
              x={centerX - 10}
              y={centerY - (showText ? 15 : 8)}
            />

            {showText && (
              <Text
                fill="#666"
                fontSize={10 * scaleFactor}
                x={centerX}
                y={centerY + 15}
                fontFamily="Baloo2_medium"
                textAnchor="middle"
              >
                Thêm kỷ niệm
              </Text>
            )}
          </>
        )}
      </Svg>
    </View>
  );
}
