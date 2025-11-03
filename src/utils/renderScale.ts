import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Cấu hình kích thước phòng
export const ROOM_WIDTH = screenWidth * 3;
export const ROOM_HEIGHT = screenHeight;

type ItemRatio = {
  xRatio: number;
  yRatio: number;
  wRatio: number;
  hRatio: number;
};

/**
 * Tính vị trí hiển thị thực tế (pixel) dựa trên tỉ lệ tương đối
 */
export const getRenderPosition = (item: ItemRatio) => {
  const x = item.xRatio * ROOM_WIDTH;
  const y = item.yRatio * ROOM_HEIGHT;
  return { x, y };
};

/**
 * Tính kích thước hiển thị thực tế (pixel) dựa trên tỉ lệ tương đối
 */
export const getRenderSize = (item: ItemRatio) => {
  const width = item.wRatio * ROOM_WIDTH;
  const height = item.hRatio * ROOM_HEIGHT;
  return { width, height };
};

/**
 * Chuyển từ vị trí pixel thực tế sang vị trí tương đối của phòng
 * Dùng khi người dùng kéo item và bạn cần lưu vị trí vào database
 */
export const getRelativePosition = (x: number, y: number) => {
  const xRatio = x / ROOM_WIDTH;
  const yRatio = y / ROOM_HEIGHT;
  return { xRatio, yRatio };
};
