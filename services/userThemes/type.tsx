export type Theme = {
  id: number;
  theme_name: string;
  theme_price: number;
  created_at: string;
  wall_url: string;
  floor_url: string;
  door_id: number | null;
  revenue_cat_product_id?: string | null;
};

export type UserThemeRow = {
  id: number;
  created_at: string;
  theme_id: number;
  user_id: string;
  theme?: Theme | null;
};
