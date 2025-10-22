import { FrameSlot } from "@src/types/frame";
import { makeAbsolute, parseSVG } from "svg-path-parser";

/**
 *  Lấy giới hạn toạ độ (bounding box) của 1 path SVG (d string)
 */
function getPathBounds(d: string) {
  const commands = makeAbsolute(parseSVG(d));
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  for (const cmd of commands) {
    if ("x" in cmd && "y" in cmd) {
      minX = Math.min(minX, cmd.x ?? 0);
      maxX = Math.max(maxX, cmd.x ?? 0);
      minY = Math.min(minY, cmd.y ?? 0);
      maxY = Math.max(maxY, cmd.y ?? 0);
    }
  }

  return { minX, minY, maxX, maxY };
}

/**
 * Tính bounding box tổng thể từ nhiều path (multiPath)
 */
function getBoundingBoxFromPaths(paths: { d: string }[]) {
  let globalMinX = Infinity,
    globalMaxX = -Infinity,
    globalMinY = Infinity,
    globalMaxY = -Infinity;

  for (const path of paths) {
    const { minX, maxX, minY, maxY } = getPathBounds(path.d);
    globalMinX = Math.min(globalMinX, minX);
    globalMaxX = Math.max(globalMaxX, maxX);
    globalMinY = Math.min(globalMinY, minY);
    globalMaxY = Math.max(globalMaxY, maxY);
  }

  const w = globalMaxX - globalMinX;
  const h = globalMaxY - globalMinY;

  return { x: globalMinX, y: globalMinY, w, h };
}

export const getCropShape = (slot: FrameSlot) => {
  switch (slot.shape.type) {
    case "circle":
      return { type: "circle" as const, size: Math.min(slot.w, slot.h) };
    case "rect":
    case "ellipse":
      return { type: "rect" as const, w: slot.w, h: slot.h };
    case "multiPath": {
      const box = getBoundingBoxFromPaths(slot.shape.paths);
      return { type: "rect" as const, w: box.w, h: box.h };
    }

    default:
      // các loại phức tạp thì chỉ lấy bounding box (rect)
      return { type: "rect" as const, w: slot.w, h: slot.h };
  }
};
