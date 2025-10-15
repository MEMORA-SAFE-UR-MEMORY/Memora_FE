import { RoomItem } from "@src/types/item";
import { Memory } from "@src/types/memory";
import { Theme } from "@src/types/theme";

export type RoomType = "private" | "public";

export interface Room {
  id: number;
  themeId?: number;
  roomName?: string;
  userId?: string;
  doorId?: string;
  type: RoomType;
  createdAt?: string;
}

export interface RoomDetail extends Room {
  theme: Theme;
  items: RoomItem[];
  memories?: Memory[];
  [key: string]: any;
}

export type DraftOp =
  | {
      op: "upsertItem";
      itemId: number; // id tạm hoặc id thật trong room
      refItemId: number; // tham chiếu đến catalog item
      x: number;
      y: number;
      zIndex: number;
      rotation: number;
    }
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
