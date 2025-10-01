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
  x_pct: number;
  y_pct: number;
  w_pct: number;
  h_pct: number;
  rotation_deg: number | null;
  z_index: number | null;
  shape: string | null;
  created_at: string | null;
};

export type TemplateWithPages = Template & {
  pages: (TemplatePage & { slots: TemplatePageSlot[] })[];
};

export type DuplicateResult = { newTemplateId: number };
