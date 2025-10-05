import { supabase } from "@src/utils/supabase";
import type {
  DuplicateResult,
  Template,
  TemplatePage,
  TemplatePageSlot,
  TemplateWithPages,
} from "./type";

export async function fetchTemplatesWithFrontCover(): Promise<Template[]> {
  const { data, error } = await supabase
    .from("templates")
    .select(
      `
      id,
      name,
      description,
      created_at,
      template_pages!inner (
        id,
        role,
        layout_url
      )
    `
    )
    .eq("template_pages.role", "front_cover")
    .order("id", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((t: any) => ({
    id: t.id,
    name: t.name,
    description: t.description ?? null,
    created_at: t.created_at,
    cover_url: t.template_pages?.[0]?.layout_url ?? null,
  }));
}

export async function fetchAllPagesOfTemplate(
  templateId: number
): Promise<TemplatePage[]> {
  const { data, error } = await supabase
    .from("template_pages")
    .select("id,template_id,page_no,role,has_slots,layout_url,created_at")
    .eq("template_id", templateId);

  if (error) throw error;

  const rank = (r: TemplatePage["role"]) =>
    r === "front_cover" ? 0 : r === "inner" ? 1 : 2;

  return (data ?? []).sort((a, b) => {
    const ra = rank(a.role);
    const rb = rank(b.role);
    if (ra !== rb) return ra - rb;
    if (a.page_no !== b.page_no) return a.page_no - b.page_no;
    return a.id - b.id;
  });
}

/** Lấy slots của 1 page */
export async function fetchPageSlots(
  pageId: number
): Promise<TemplatePageSlot[]> {
  const { data, error } = await supabase
    .from("template_page_slots")
    .select(
      "id, template_page_id, slot_index, x_pct, y_pct, w_pct, h_pct, rotation_deg, z_index, shape, created_at"
    )
    .eq("template_page_id", pageId)
    .order("slot_index", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/**
 * Lấy full 1 template: pages + slots (nested).
 * LƯU Ý: PostgREST không đảm bảo sort trong nested -> sort lại ở client nếu cần.
 */
export async function fetchTemplateFull(
  templateId: number
): Promise<TemplateWithPages | null> {
  const { data, error } = await supabase
    .from("templates")
    .select(
      `
      id,
      name,
      description,
      created_at,
      template_pages (
        id,
        template_id,
        page_no,
        layout_url,
        created_at,
        role,
        has_slots,
        template_page_slots (
          id,
          template_page_id,
          slot_index,
          x_pct, y_pct, w_pct, h_pct,
          rotation_deg, z_index, shape, created_at
        )
      )
    `
    )
    .eq("id", templateId)
    .single();

  if (error) throw error;
  if (!data) return null;

  const pages = (data.template_pages ?? [])
    .sort((a: any, b: any) => a.page_no - b.page_no)
    .map((p: any) => ({
      id: p.id,
      template_id: p.template_id,
      page_no: p.page_no,
      layout_url: p.layout_url ?? null,
      created_at: p.created_at ?? null,
      role: p.role,
      has_slots: p.has_slots,
      slots: (p.template_page_slots ?? []).sort(
        (s1: any, s2: any) =>
          (s1.z_index ?? 0) - (s2.z_index ?? 0) || s1.slot_index - s2.slot_index
      ),
    }));

  const front = pages.find((p) => p.role === "front_cover") ?? null;
  const cover_url = front?.layout_url ?? null;

  return {
    id: data.id,
    name: data.name,
    description: data.description ?? null,
    created_at: data.created_at,
    cover_url,
    pages,
  };
}

export async function duplicateTemplate(
  templateId: number
): Promise<DuplicateResult> {
  return { newTemplateId: templateId };
}
