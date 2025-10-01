import { useCallback, useEffect, useState } from "react";
import { fetchTemplatesWithFrontCover, fetchTemplateFull } from "./api";
import type { Template, TemplateWithPages } from "./type";

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
