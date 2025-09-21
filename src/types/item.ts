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
