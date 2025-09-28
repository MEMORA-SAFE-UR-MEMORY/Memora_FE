import { FrameSlot } from "@src/types/frame";
import { generateStarPoints } from "@src/utils/geometry";
import { Circle, Ellipse, Path, Polygon, Rect } from "react-native-svg";

export function renderShape(slot: FrameSlot, props?: any) {
  switch (slot.shape.type) {
    case "rect":
      return (
        <Rect
          x={slot.shape.x}
          y={slot.shape.y}
          width={slot.shape.w}
          height={slot.shape.h}
          rx={slot.shape.rx}
          ry={slot.shape.ry}
          {...props}
        />
      );
    case "circle":
      return (
        <Circle
          cx={slot.shape.cx}
          cy={slot.shape.cy}
          r={slot.shape.r}
          {...props}
        />
      );
    case "ellipse":
      return (
        <Ellipse
          cx={slot.shape.cx}
          cy={slot.shape.cy}
          rx={slot.shape.rx}
          ry={slot.shape.ry}
          {...props}
        />
      );
    case "polygon":
      return (
        <Polygon
          points={generateStarPoints(
            slot.w / 2,
            slot.h / 2,
            5,
            slot.w / 2,
            slot.h / 4
          )}
          {...props}
        />
      );
    case "path":
      return (
        <Path
          d={slot.shape.d}
          fillRule={slot.shape.fillRule ?? "nonzero"}
          {...props}
        />
      );
    case "multiPath":
      return slot.shape.paths.map((p, i) => (
        <Path
          key={i}
          d={p.d}
          fill={p.fill ?? "none"}
          stroke={p.stroke ?? "none"}
          {...props}
        />
      ));
  }
}
