export type Door = {
  id: number;
  img_url: string;
  created_at: string;
  color_hex: string;
};

export type Room = {
  id: number;
  room_name: string;
  // theme id từ bảng themes (đến user_themes.theme_id)
  theme_id?: number | null;
  // Khóa ngoại lưu trong `rooms.theme_id` liên tới `user_themes.id`
  user_theme_id?: number | null;
  created_at: string;
  user_id: string;
  door_id: number | null;
  door?: Door;
};
