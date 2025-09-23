import { ImageSourcePropType } from "react-native";

export type RealItem = {
  id: string;
  categoryId: number;
  name: string;
  url: ImageSourcePropType;
};

export type EmptyItem = {
  id: string;
  empty: true;
};

export type Item = RealItem | EmptyItem;

export type PlacedItem = {
  id: string;
  type: "frame" | "sticker" | "furniture";
  frameUrl: any;
  x: number;
  y: number;
};
