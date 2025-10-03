import { InventoryRepo } from "@src/repositories/inventoryRepo";
import { InventoryItem } from "@src/types/item";

export const InventoryService = {
  async initByUser(userId: string | null): Promise<InventoryItem[]> {
    if (!userId) {
      console.warn("initByUser called with null userId");
      return [];
    }
    return await InventoryRepo.loadByUser(userId);
  },

  getItemById: (id: number): InventoryItem | undefined => {
    return InventoryRepo.getItemById(id);
  },

  getAllItems: (): InventoryItem[] => {
    return InventoryRepo.getAll();
  },

  decreaseQuantity: async (itemId: number) => {
    const item = InventoryRepo.getItemById(itemId);
    if (item && item.quantity > 0) {
      InventoryRepo.updateCacheQuantity(itemId, item.quantity - 1);
      await InventoryRepo.updateQuantity(itemId, item.quantity - 1);
    }
  },

  increaseQuantity: async (itemId: number) => {
    const item = InventoryRepo.getItemById(itemId);
    if (item) {
      InventoryRepo.updateCacheQuantity(itemId, item.quantity + 1);
      await InventoryRepo.updateQuantity(itemId, item.quantity + 1);
    }
  },
};
