import { RoomItem } from "@src/types/item";
import { Theme } from "@src/types/theme";

export interface Room {
  id: number;
  themeId: number;
  roomName: string;
  userId: string;
  doorId: string;
  createdAt: string;
}

export interface RoomDetail extends Room {
  theme: Theme; 
  items: RoomItem[]; 
}
