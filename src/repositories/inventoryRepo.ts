import { InventoryApi } from "@src/apis/inventoryApi";
import { InventoryItem, Item } from "@src/types/item";

let inventoryCache: Record<number, InventoryItem> = {};

export const InventoryRepo = {
  async loadByUser(userId: string): Promise<InventoryItem[]> {
    const data = await InventoryApi.fetchByUser(userId);

    const items: InventoryItem[] =
      data?.inventory_items
        ?.filter((inv: any) => inv.item !== null)
        .map((inv: any) => {
          const it = inv.item;
          const mappedItem: Item = {
            id: it.id,
            name: it.name,
            puzzlePrice: it.puzzle_price,
            categoryId: it.category_id,
            type: it.type,
            imageUrl: it.item_image_path, // FE có thể require() nếu local asset
            themeId: it.theme_id,
            dimension: {
              id: it.dimension?.id,
              w: it.dimension?.w,
              h: it.dimension?.h,
            },
            slots: it.slots?.map((s: any) => ({
              id: s.id,
              slotId: s.slot_id,
              x: s.x,
              y: s.y,
              w: s.w,
              h: s.h,
              rotation: s.rotation,
              shape: s.shape,
            })),
            createdAt: it.created_at,
          };

          return {
            id: inv.id,
            quantity: inv.quantity,
            item: mappedItem,
          } as InventoryItem;
        }) ?? [];

    inventoryCache = Object.fromEntries(items.map((it) => [it.item.id, it]));
    return items;
  },

  getItemById: (itemId: number): InventoryItem | undefined => {
    return inventoryCache[itemId];
  },

  getAll: (): InventoryItem[] => Object.values(inventoryCache),

  updateCacheQuantity: (itemId: number, quantity: number) => {
    const item = inventoryCache[itemId];
    if (item) {
      inventoryCache[itemId] = { ...item, quantity };
    }
  },

  updateQuantity: async (itemId: number, quantity: number) => {
    const item = inventoryCache[itemId];
    if (!item) return;
    await InventoryApi.updateQuantity(item.id, quantity);
  },
};
