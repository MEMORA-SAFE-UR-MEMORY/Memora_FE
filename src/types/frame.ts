import { Memory } from "@src/types/memory";

export type SlotShape =
  | {
      type: "rect";
      x: number;
      y: number;
      w: number;
      h: number;
      rx?: number;
      ry?: number;
    } // có bo góc
  | { type: "circle"; cx: number; cy: number; r: number }
  | { type: "ellipse"; cx: number; cy: number; rx: number; ry: number }
  | { type: "polygon"; points: string } // "x1,y1 x2,y2 ..."
  | { type: "path"; d: string; fillRule?: "nonzero" | "evenodd" }; // Các hình phức tạp

export interface FrameSlot {
  slotId: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number;
  shape: SlotShape;
}

export type SlotMemoryMap = {
  [slotId: number]: Memory | null;
};
