import { useState, useCallback } from "react";
import { supabase } from "@src/lib/supabase";

interface Category {
  id: number;
  name: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("id");

      if (error) throw error;

      setCategories(data as Category[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategoryById = useCallback(
    (id: number) => {
      return categories.find((category) => category.id === id);
    },
    [categories]
  );

  const getCategoryName = useCallback(
    (id: number) => {
      return categories.find((category) => category.id === id)?.name || "";
    },
    [categories]
  );

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategoryById,
    getCategoryName,
  };
}
