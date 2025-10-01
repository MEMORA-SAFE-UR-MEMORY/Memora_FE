export type Door = {
  id: number;
  img_url: string;
  created_at: string;
  color_hex: string;
};

export type Room = {
  id: number;
  room_name: string;
  theme_id?: number | null;
  created_at: string;
  user_id: string;
  door_id: number;
  door?: Door;
};
