import { FrameSlot } from "@src/types/frame";
import { Memory } from "@src/types/memory";
import { renderShape } from "@src/utils/renderShape";
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
  frameWidth: number;
  frameHeight: number;
};

export function FrameView({
  slot,
  memory,
  frameWidth,
  frameHeight,
}: FrameViewProps) {
  const clipId = `clip-${slot.slotId}`;

  return (
    <Svg
      width={slot.w}
      height={slot.h}
      style={{
        position: "absolute",
        top: slot.y,
        left: slot.x,
      }}
    >
      <Defs>
        <ClipPath id={clipId}>{renderShape(slot)}</ClipPath>
      </Defs>

      {memory?.image ? (
        <SvgImage
          width={slot.w}
          height={slot.h}
          href={{ uri: memory.image }}
          clipPath={`url(#${clipId})`}
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <>
          {/* nền placeholder */}
          {renderShape(slot, { fill: "#f0f0f0" })}

          {/* icon + text đặt giữa */}
          <Path
            d="M18 15V18H15V20H18V23H20V20H23V18H20V15H18M13.3 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V13.3C20.4 13.1 19.7 13 19 13C17.9 13 16.8 13.3 15.9 13.9L14.5 12L11 16.5L8.5 13.5L5 18H13.1C13 18.3 13 18.7 13 19C13 19.7 13.1 20.4 13.3 21Z"
            fill="#666"
            scale={0.8}
            x={slot.w / 2 - 10}
            y={slot.h / 2 - 15}
          />
          <Text
            fill="#666"
            fontSize="10"
            x={slot.w / 2}
            y={slot.h / 2 + 15}
            fontFamily="Baloo2_medium"
            textAnchor="middle"
          >
            Thêm kỷ niệm
          </Text>
        </>
      )}
    </Svg>
  );
}
