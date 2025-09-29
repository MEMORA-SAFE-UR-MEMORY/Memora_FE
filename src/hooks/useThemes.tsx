// src/hooks/useThemes.ts
import { useState, useCallback } from "react";
import { supabase } from "@src/lib/supabase";

export type Theme = {
  id: number;
  theme_name: string;
  theme_price: number;
};

export const useThemes = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThemes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("themes")
        .select("id, theme_name, theme_price")
        .order("id", { ascending: true });

      if (error) throw error;
      setThemes(data || []);
    } catch (err: any) {
      console.error("Fetch themes error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { themes, loading, error, fetchThemes };
};
