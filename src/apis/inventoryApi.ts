import { supabase } from "@src/lib/supabase";

export const InventoryApi = {
  async fetchByUser(userId: string) {
    const { data, error } = await supabase
      .from("inventories")
      .select(
        `
        id,
        inventory_items (
            id,
            quantity,
            created_at,
            item:items (
            id,
            name,
            puzzle_price,
            category_id,
            item_image_path,
            type,
            theme_id,
            created_at,
            dimension:item_dimension(id, w, h),
            slots:frame_slots(id, slot_id, x, y, w, h, rotation, shape)
            )
        )
        `
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateQuantity(inventoryItemId: number, newQuantity: number) {
    const { data, error } = await supabase
      .from("inventory_items")
      .update({ quantity: newQuantity })
      .eq("id", inventoryItemId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};
