import { ImageSourcePropType } from "react-native";

export type Item = {
  id: number;
  name: string;
  puzzlePrice: number;
  categoryId: number;
  imageUrl: ImageSourcePropType;
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

export interface UserInventory {
  userId: string;
  items: InventoryItem[];
}

export interface RoomItem {
  id: number;
  x: number;
  y: number;
  zIndex: number;
  rotation?: number;
  userImageUrl?: string;
  item: Item;
}
