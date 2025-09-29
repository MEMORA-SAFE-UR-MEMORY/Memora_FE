// src/hooks/useInventoryItems.ts
import { useState } from "react";
import { supabase } from "@src/lib/supabase";

export const useInventoryItems = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm thêm item vào inventory
  const addItemToInventory = async (
    inventoryId: number,
    itemId: number,
    quantity: number = 1
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Check nếu item đã tồn tại trong inventory
      const { data: existing, error: fetchError } = await supabase
        .from("inventory_items")
        .select("id, quantity")
        .eq("inventory_id", inventoryId)
        .eq("item_id", itemId)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (existing) {
        // Nếu đã có thì update quantity
        const { data, error: updateError } = await supabase
          .from("inventory_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return data;
      } else {
        // Nếu chưa có thì insert mới
        const { data, error: insertError } = await supabase
          .from("inventory_items")
          .insert([{ inventory_id: inventoryId, item_id: itemId, quantity }])
          .select()
          .single();

        if (insertError) throw insertError;
        return data;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addItemToInventory, loading, error };
};
