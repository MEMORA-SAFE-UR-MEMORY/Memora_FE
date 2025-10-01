import { InventoryItem } from "@src/types/item";
import { InventoryRepo } from "@src/repositories/inventoryRepo";

export const InventoryService = {
  initItems: (items: InventoryItem[]) => {
    InventoryRepo.setItems(items);
  },

  getItemById: (id: number): InventoryItem | undefined => {
    return InventoryRepo.getItemById(id);
  },

  getAllItems: (): InventoryItem[] => {
    return InventoryRepo.getAll();
  },

  decreaseQuantity: (itemId: number) => {
    const item = InventoryRepo.getItemById(itemId);
    if (item && item.quantity > 0) {
      InventoryRepo.updateQuantity(itemId, item.quantity - 1);
    }
  },

  increaseQuantity: (itemId: number) => {
    const item = InventoryRepo.getItemById(itemId);
    if (item) {
      InventoryRepo.updateQuantity(itemId, item.quantity + 1);
    }
  },
};
