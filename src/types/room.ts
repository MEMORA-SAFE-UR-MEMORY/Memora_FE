import { RoomItem } from "@src/types/item";
import { Theme } from "@src/types/theme";

export type RoomType = "private" | "public";

export interface Room {
  id: number;
  themeId: number;
  roomName: string;
  userId: string;
  doorId: string;
  type: RoomType;
  createdAt: string;
}

export interface RoomDetail extends Room {
  theme: Theme;
  items: RoomItem[];
  [key: string]: any;
}

export type DraftOp =
  | {
      op: "addItem";
      itemId: number; // id tạm trong room (temp id)
      refItemId: number; // tham chiếu đến catalog item
      x: number;
      y: number;
      zIndex: number;
    }
  | { op: "moveItem"; itemId: number; x: number; y: number; zIndex: number }
  | { op: "rotateItem"; itemId: number; rotation: number }
  | { op: "removeItem"; itemId: number }
  | {
      op: "setSlotMemory" | "updateSlotMemory";
      roomItemId: number;
      slotId: number;
      memoryId: number | null;
    }
  | { op: "deleteSlotMemory"; roomItemId: number; slotId: number };

export interface Draft {
  roomId: number;
  lastEdited: string; // ISO
  patches: DraftOp[];
}
