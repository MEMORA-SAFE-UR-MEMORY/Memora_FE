import { ImageSourcePropType } from "react-native";

export interface Theme {
  id: number;
  themeName: string;
  themePrice: number;
  wallUrl: ImageSourcePropType;
  floorUrl: ImageSourcePropType;
  createdAt: string;
}
