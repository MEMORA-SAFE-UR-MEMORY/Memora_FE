import { useState, useCallback } from "react";
import { supabase } from "@src/utils/supabase";

interface Item {
  id: number;
  name: string;
  type: string;
  item_image_path: string;
  category_id: number;
  theme_id: number | null;
  dimension_id: number | null;
  puzzle_price: number | null;
  created_at: string;
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📌 Lấy danh sách items
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("id");

    if (error) {
      setError(error.message);
    } else {
      setItems((data as Item[]) || []);
    }
    setLoading(false);
  }, []);

  // 📌 Thêm item
  const addItem = useCallback(async (newItem: Omit<Item, "id">) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("items")
      .insert(newItem)
      .select();

    if (error) {
      setError(error.message);
    } else if (data) {
      setItems((prev) => [...prev, ...data]);
    }
    setLoading(false);
  }, []);

  // 📌 Cập nhật item
  const updateItem = useCallback(async (id: number, updates: Partial<Item>) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("items")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      setError(error.message);
    } else if (data) {
      setItems((prev) => prev.map((item) => (item.id === id ? data[0] : item)));
    }
    setLoading(false);
  }, []);

  // 📌 Xoá item
  const deleteItem = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
    setLoading(false);
  }, []);

  return { items, loading, error, fetchItems, addItem, updateItem, deleteItem };
}
