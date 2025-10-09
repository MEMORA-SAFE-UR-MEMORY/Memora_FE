export type Template = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  cover_url: string | null;
};

export type TemplatePage = {
  id: number;
  template_id: number;
  page_no: number;
  role: "front_cover" | "inner" | "back_cover";
  has_slots: boolean;
  layout_url: string | null;
  created_at: string | null;
};

export type TemplatePageSlot = {
  id: number;
  template_page_id: number;
  slot_index: number;
  shape: string | null;
  created_at: string | null;
};

export type Album = {
  id: number;
  user_id: string;
  name: string;
  template_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  is_ordered?: boolean;
};

export type AlbumSlotLite = {
  id: number;
  slot_index: number;
  photo_url: string | null;
};

export type AlbumPageLite = {
  id: number;
  page_no: number;
  layout_snapshot_url: string | null;
  slots: AlbumSlotLite[];
};

export type TemplateWithPages = Template & {
  pages: (TemplatePage & { slots: TemplatePageSlot[] })[];
};

export type AlbumWithProgress = {
  id: number;
  name: string;
  created_at: string | null;
  cover_url: string | null;
  total_slots: number;
  filled_slots: number;
  is_ordered?: boolean;
};
