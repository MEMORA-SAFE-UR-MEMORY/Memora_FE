import { FrameSlot, SlotMemoryMap } from "@src/types/frame";

export type Dimension = {
  id: number;
  w: number;
  h: number;
};

export type Item = {
  id: number;
  name: string;
  puzzlePrice?: number;
  categoryId: number;
  type?: string;
  imageUrl: string;
  dimension: Dimension;
  slots?: FrameSlot[];
  themeId?: number;
  createdAt: string;
};

export interface InventoryItem {
  id: number;
  quantity: number;
  item: Item;
}

export interface EmptyInventoryItem {
  id: string;
  empty: true;
}

export type InventoryList = InventoryItem | EmptyInventoryItem;

export interface RoomItem {
  id: number;
  x: number;
  y: number;
  zIndex: number;
  rotation?: number;
  item: Item;
  slotMemories?: SlotMemoryMap;
  [key: string]: any;
}
