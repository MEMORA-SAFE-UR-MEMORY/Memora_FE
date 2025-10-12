import { FrameSlot } from "@src/types/frame";

export const getCropShape = (slot: FrameSlot) => {
  switch (slot.shape.type) {
    case "circle":
      return { type: "circle" as const, size: Math.min(slot.w, slot.h) };
    case "rect":
    case "ellipse":
      return { type: "rect" as const, w: slot.w, h: slot.h };
    default:
      // các loại phức tạp thì chỉ lấy bounding box (rect)
      return { type: "rect" as const, w: slot.w, h: slot.h };
  }
};
