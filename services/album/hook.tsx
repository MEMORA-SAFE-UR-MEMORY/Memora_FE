import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ORDERED_ALBUMS_EVENT, orderEvents } from "../events/orderEvents";
import {
  createAlbumFromTemplate,
  deleteAlbum,
  fetchAlbumIsOrdered,
  fetchAlbumPages,
  fetchOrderableAlbums,
  fetchSlotPhoto,
  fetchTemplateFull,
  fetchTemplatesWithFrontCover,
  fetchUserAlbums,
  updateAlbumName,
} from "./api";
import type {
  Album,
  AlbumPageLite,
  AlbumWithProgress,
  Template,
  TemplateWithPages,
} from "./type";

export function useAlbumTemplates() {
  const [data, setData] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchTemplatesWithFrontCover();
      setData(rows);
    } catch (e: any) {
      setError(e?.message ?? "Không tải được templates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

export function useTemplateFull(templateId?: number) {
  const [data, setData] = useState<TemplateWithPages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!templateId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTemplateFull(templateId);
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? "Không tải được template");
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

// Helper: read user id from AsyncStorage. Tries `user` JSON then fallback `userId`
export async function getUserIdFromStorage(): Promise<string | null> {
  try {
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed?.id) return String(parsed.id);
      } catch {}
    }
    const uid = await AsyncStorage.getItem("userId");
    return uid ?? null;
  } catch {
    return null;
  }
}

// Hook: my albums list for current user
export function useMyAlbums() {
  const [data, setData] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const uid = await getUserIdFromStorage();
      setUserId(uid);
      if (!uid) {
        setData([]);
        return;
      }
      const rows = await fetchUserAlbums(uid);
      setData(rows);
    } catch (e: any) {
      setError(e?.message ?? "Không tải được albums");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Focus → reload
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  // Lắng nghe sự kiện đặt hàng để cập nhật tại chỗ
  useEffect(() => {
    const handler = (ids: number[]) => {
      setData((prev) =>
        prev.map((a) => (ids.includes(a.id) ? { ...a, is_ordered: true } : a))
      );
    };
    orderEvents.on(ORDERED_ALBUMS_EVENT, handler);
    return () => {
      orderEvents.off(ORDERED_ALBUMS_EVENT, handler);
    };
  }, []);

  const markAlbumsOrderedLocal = useCallback((ids: number[]) => {
    if (!ids.length) return;
    setData((prev) =>
      prev.map((a) => (ids.includes(a.id) ? { ...a, is_ordered: true } : a))
    );
  }, []);

  return { data, loading, error, userId, reload: load, markAlbumsOrderedLocal };
}

// Hook: load pages + slots for an album
export function useAlbumPages(albumId?: number) {
  const [data, setData] = useState<AlbumPageLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrdered, setIsOrdered] = useState(false);

  const load = useCallback(async () => {
    if (!albumId) return;
    setLoading(true);
    setError(null);
    try {
      const [pages, ordered] = await Promise.all([
        fetchAlbumPages(albumId),
        fetchAlbumIsOrdered(albumId).catch(() => false),
      ]);
      setData(pages);
      setIsOrdered(ordered);
    } catch (e: any) {
      setError(e?.message ?? "Không tải được trang album");
      setData([]);
      setIsOrdered(false);
    } finally {
      setLoading(false);
    }
  }, [albumId]);

  // Patch a single slot locally
  const patchSlotPhoto = useCallback(
    (slotId: number, photoUrl: string | null) => {
      setData((prev) =>
        prev.map((p) => ({
          ...p,
          slots: p.slots.map((s) =>
            s.id === slotId ? { ...s, photo_url: photoUrl ?? null } : s
          ),
        }))
      );
    },
    []
  );

  // Fetch only that slot from server and update state
  const refreshSlot = useCallback(async (slotId: number) => {
    const s = await fetchSlotPhoto(slotId);
    setData((prev) =>
      prev.map((p) => ({
        ...p,
        slots: p.slots.map((sl) =>
          sl.id === slotId ? { ...sl, photo_url: s.photo_url ?? null } : sl
        ),
      }))
    );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    reload: load,
    refreshSlot,
    patchSlotPhoto,
    isOrdered,
  };
}

// Hook: clone album from a template for current user
export function useCloneAlbum() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAlbumId, setLastAlbumId] = useState<number | null>(null);

  const clone = useCallback(async (templateId: number, name?: string) => {
    setLoading(true);
    setError(null);
    try {
      const uid = await getUserIdFromStorage();
      if (!uid) throw new Error("Chưa đăng nhập");
      const albumId = await createAlbumFromTemplate(templateId, uid, name);
      setLastAlbumId(albumId);
      return albumId;
    } catch (e: any) {
      setError(e?.message ?? "Không thể tạo bản sao");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { clone, loading, error, lastAlbumId };
}

// Hook: rename an album
export function useRenameAlbum(onSuccess?: (updated: Album) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rename = useCallback(
    async (albumId: number, newName: string) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await updateAlbumName(albumId, newName);
        onSuccess?.(updated);
        return updated;
      } catch (e: any) {
        setError(e?.message ?? "Không đổi tên được album");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess]
  );

  return { rename, loading, error };
}

// Hook: delete an album
export function useDeleteAlbum(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(
    async (albumId: number) => {
      setLoading(true);
      setError(null);
      try {
        await deleteAlbum(albumId);
        onSuccess?.();
      } catch (e: any) {
        setError(e?.message ?? "Không xóa được album");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess]
  );

  return { remove, loading, error };
}

export function useOrderableAlbums() {
  const [data, setData] = useState<AlbumWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const uid = await getUserIdFromStorage();
      if (!uid) {
        setData([]);
        setError("Chưa đăng nhập");
        return;
      }
      const rows = await fetchOrderableAlbums(uid);
      setData(rows);
    } catch (e: any) {
      setError(e?.message ?? "Không tải được danh sách đặt hàng");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
