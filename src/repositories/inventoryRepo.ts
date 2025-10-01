import { InventoryItem } from "@src/types/item";

// mock local cache (sau có thể thay bằng Supabase/AsyncStorage)
let inventoryCache: Record<number, InventoryItem> = {};

export const InventoryRepo = {
  setItems: (items: InventoryItem[]) => {
    inventoryCache = Object.fromEntries(items.map((it) => [it.item.id, it]));
  },

  getItemById: (itemId: number): InventoryItem | undefined => {
    return inventoryCache[itemId];
  },

  getAll: (): InventoryItem[] => Object.values(inventoryCache),

  updateQuantity: (itemId: number, quantity: number) => {
    const item = inventoryCache[itemId];
    if (item) {
      inventoryCache[itemId] = { ...item, quantity };
    }
  },
};
