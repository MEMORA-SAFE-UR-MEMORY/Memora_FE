// context/InventoryContext.tsx
import { useAuthContext } from "@src/context/AuthContext";
import { useCategories } from "@src/hooks/useCategories";
import { InventoryService } from "@src/services/inventoryService";
import { CategoryWithIcon } from "@src/types/category";
import {
  EmptyInventoryItem,
  InventoryItem,
  InventoryList,
} from "@src/types/item";
import { mapCategoryWithIcon } from "@src/utils/mapCategory";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type InventoryContextType = {
  categories: CategoryWithIcon[];
  items: InventoryList[];
  selectedCategory: number;
  setSelectedCategory: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  refreshInventory: () => Promise<void>;
};

const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { categories: rawCategories, fetchCategories } = useCategories();
  const [categories, setCategories] = useState<CategoryWithIcon[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const { user } = useAuthContext();

  // fetch categories khi mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // convert category -> CategoryWithIcon khi rawCategories thay đổi
  useEffect(() => {
    if (rawCategories.length > 0) {
      const limited = rawCategories.slice(0, 2); // chỉ lấy 2 cái đầu
      setCategories(limited.map(mapCategoryWithIcon));

      if (!selectedCategory && limited[0]) {
        setSelectedCategory(limited[0].id);
      }
    }
  }, [rawCategories]);

  // fetch inventory chỉ chạy khi user load xong
  useEffect(() => {
    if (!user?.id) return;
    const loadInventory = async () => {
      const items = await InventoryService.initByUser(user.id);
      setInventory(items);
    };
    loadInventory();
  }, [user]);

  const decreaseQuantity = (itemId: number) => {
    InventoryService.decreaseQuantity(itemId);
    setInventory([...InventoryService.getAllItems()]);
  };

  const increaseQuantity = (itemId: number) => {
    InventoryService.increaseQuantity(itemId);
    setInventory([...InventoryService.getAllItems()]);
  };

  // filter items theo category + thêm empty slot nếu lẻ
  const filteredItems = useMemo<InventoryList[]>(() => {
    let result: InventoryList[] = inventory
      .filter(
        (it): it is InventoryItem => it.item.categoryId === selectedCategory
      )
      .sort((a, b) => a.item.id - b.item.id);

    if (result.length % 2 !== 0) {
      const empty: EmptyInventoryItem = {
        id: `empty-${selectedCategory}-${Date.now()}`,
        empty: true,
      };
      result = [...result, empty];
    }

    return result;
  }, [selectedCategory, inventory]);

  const refreshInventory = async () => {
    if (!user?.id) return;
    const items = await InventoryService.initByUser(user.id);
    setInventory(items);
  };

  return (
    <InventoryContext.Provider
      value={{
        categories,
        items: filteredItems,
        selectedCategory,
        setSelectedCategory,
        increaseQuantity,
        decreaseQuantity,
        refreshInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx)
    throw new Error("useInventory must be used inside InventoryProvider");
  return ctx;
};
