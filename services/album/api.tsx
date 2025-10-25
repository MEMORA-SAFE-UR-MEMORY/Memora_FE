import { supabase } from "@src/utils/supabase";
import type {
  Album,
  AlbumPageLite,
  AlbumWithProgress,
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
    .select("id, template_page_id, slot_index, shape, created_at")
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
          shape,
          created_at
        )
      )
    `
    )
    .eq("id", templateId)
    .single();

  if (error) throw error;
  if (!data) return null;

  const pages = (data.template_pages ?? [])
    .sort((a: any, b: any) => (a.page_no ?? 0) - (b.page_no ?? 0))
    .map((p: any) => ({
      id: p.id,
      template_id: p.template_id,
      page_no: p.page_no,
      layout_url: p.layout_url ?? null,
      created_at: p.created_at ?? null,
      role: p.role,
      has_slots: p.has_slots,
      slots: (p.template_page_slots ?? []).sort(
        (s1: any, s2: any) => (s1.slot_index ?? 0) - (s2.slot_index ?? 0)
      ),
    }));

  const front = pages.find((p) => p.role === "front_cover") ?? null;

  return {
    id: data.id,
    name: data.name,
    description: data.description ?? null,
    created_at: data.created_at,
    cover_url: front?.layout_url ?? null,
    pages,
  };
}

// CLONE ALBUM TỪ TEMPLATE
export async function createAlbumFromTemplate(
  templateId: number,
  userId: string,
  name?: string
) {
  const params: Record<string, any> = {
    p_user_id: userId,
    p_template_id: templateId,
  };
  if (typeof name === "string" && name.trim() !== "") {
    params.p_album_name = name.trim();
  }

  const { data, error } = await supabase.rpc(
    "clone_album_from_template",
    params
  );
  if (error) throw error;
  return data as number; // new album_id
}

// DANH SÁCH ALBUM CỦA USER
export async function fetchUserAlbums(userId: string): Promise<Album[]> {
  const { data, error } = await supabase
    .from("albums")
    .select("id,user_id,name,template_id,created_at,updated_at,is_ordered")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Album[];
}

// LOAD PAGES + SLOTS CỦA 1 ALBUM
export async function fetchAlbumPages(
  albumId: number
): Promise<AlbumPageLite[]> {
  const { data, error } = await supabase
    .from("album_pages")
    .select(
      `
      id, page_no, layout_snapshot_url,
      album_page_slots ( id, slot_index, photo_url )
    `
    )
    .eq("album_id", albumId)
    .order("page_no", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((p: any) => ({
    id: p.id,
    page_no: p.page_no,
    layout_snapshot_url: p.layout_snapshot_url ?? null,
    slots: (p.album_page_slots ?? []).sort(
      (a: any, b: any) => a.slot_index - b.slot_index
    ),
  }));
}

// LẤY 1 SLOT (chỉ cần photo_url) – dùng để refresh ô sau upload
export async function fetchSlotPhoto(
  slotId: number
): Promise<{ id: number; photo_url: string | null }> {
  const { data, error } = await supabase
    .from("album_page_slots")
    .select("id, photo_url")
    .eq("id", slotId)
    .single();
  if (error) throw error;
  return { id: data!.id, photo_url: data!.photo_url ?? null };
}

// CẬP NHẬT ẢNH CHO SLOT
export async function updateSlotPhoto(slotId: number, photoUrl: string) {
  const { error } = await supabase
    .from("album_page_slots")
    .update({ photo_url: photoUrl, updated_at: new Date().toISOString() })
    .eq("id", slotId);
  if (error) throw error;
}

// CẬP NHẬT ẢNH CHO SLOT QUA RPC (RLS-safe)
export async function updateSlotPhotoRpc(
  slotId: number,
  photoUrl: string,
  userId: string
) {
  const { error } = await supabase.rpc("update_album_slot_photo", {
    p_user_id: userId,
    p_slot_id: slotId,
    p_photo_url: photoUrl,
  });
  if (error) throw error;
}

// ĐỔI TÊN ALBUM
export async function updateAlbumName(
  albumId: number,
  newName: string
): Promise<Album> {
  const name = (newName ?? "").trim();
  if (!name) throw new Error("Tên không được để trống");
  const { data, error } = await supabase
    .from("albums")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", albumId)
    .select("*")
    .single();
  if (error) throw error;
  return data as Album;
}

// XÓA ALBUM
export async function deleteAlbum(albumId: number): Promise<void> {
  const { error } = await supabase.from("albums").delete().eq("id", albumId);
  if (error) throw error;
}

// UPLOAD 1 ẢNH QUA BACKEND ENDPOINT (API riêng)
export type RNFileLike = { uri: string; name: string; type: string };

export async function uploadSlotPhotoViaApi(params: {
  slotId: number;
  file: RNFileLike;
}): Promise<void> {
  const { slotId, file } = params;
  const base = process.env.EXPO_PUBLIC_API_URL;
  const endpoint = `${base}/api/AlbumPageSlot/upload-1-photo?Id=${encodeURIComponent(
    String(slotId)
  )}`;

  const form = new FormData();
  form.append("Photo", {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as any);

  const res = await fetch(endpoint, {
    method: "PUT",
    body: form,
  });

  if (!res.ok) {
    let msg = "Upload ảnh thất bại";
    try {
      const text = await res.text();
      if (text) msg = text;
    } catch {}
    throw new Error(msg);
  }
}

// Fetch albums of a user with slot progress (total vs filled)
export async function fetchAlbumsWithProgress(
  userId: string
): Promise<AlbumWithProgress[]> {
  const { data, error } = await supabase
    .from("albums")
    .select(
      `
      id,
      name,
      created_at,
        is_ordered,
      album_pages (
        id,
        layout_snapshot_url,
        album_page_slots (
          id,
          photo_url
        )
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((a: any) => {
    const pages = a.album_pages ?? [];
    const total = pages.reduce(
      (sum: number, p: any) => sum + (p.album_page_slots?.length ?? 0),
      0
    );
    const filled = pages.reduce(
      (sum: number, p: any) =>
        sum +
        (p.album_page_slots?.filter(
          (s: any) => !!(s.photo_url && String(s.photo_url).trim() !== "")
        ).length ?? 0),
      0
    );
    const cover =
      pages.find((p: any) => !!p.layout_snapshot_url)?.layout_snapshot_url ??
      null;

    return {
      id: a.id as number,
      name: a.name as string,
      created_at: a.created_at ?? null,
      cover_url: cover,
      total_slots: total,
      filled_slots: filled,
      is_ordered: !!a.is_ordered,
    } as AlbumWithProgress;
  });
}

// Convenience: only albums that are fully filled (orderable)
export async function fetchOrderableAlbums(
  userId: string
): Promise<AlbumWithProgress[]> {
  const rows = await fetchAlbumsWithProgress(userId);
  return rows.filter(
    (r) =>
      r.total_slots > 0 && r.filled_slots === r.total_slots && !r.is_ordered
  );
}

// NEW: lấy trạng thái is_ordered của 1 album
export async function fetchAlbumIsOrdered(albumId: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("albums")
    .select("id,is_ordered")
    .eq("id", albumId)
    .single();
  if (error) throw error;
  return !!data?.is_ordered;
}

// NEW: cập nhật nhiều album là đã đặt (fallback nếu backend chưa tự làm)
export async function markAlbumsOrdered(albumIds: number[]): Promise<void> {
  if (!albumIds.length) return;
  const { error } = await supabase
    .from("albums")
    .update({ is_ordered: true, updated_at: new Date().toISOString() })
    .in("id", albumIds);
  if (error) throw error;
}
