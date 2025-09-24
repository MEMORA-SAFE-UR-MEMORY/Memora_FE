// context/InventoryContext.tsx
import { Category, CategoryWithIcon } from "@src/types/category";
import {
  EmptyInventoryItem,
  InventoryItem,
  InventoryList,
  UserInventory,
} from "@src/types/item";
import { mapCategoryWithIcon } from "@src/utils/mapCategory";
import React, { createContext, useContext, useMemo, useState } from "react";

type InventoryContextType = {
  categories: CategoryWithIcon[];
  items: InventoryList[]; 
  selectedCategory: number;
  setSelectedCategory: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
};

const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // categories mock
  const rawCategories: Category[] = [
    { id: 1, name: "Khung", createdAt: "2025-09-01" },
    { id: 2, name: "Sticker", createdAt: "2025-09-01" },
    { id: 3, name: "Tường", createdAt: "2025-09-01" },
    { id: 4, name: "Sàn", createdAt: "2025-09-01" },
    { id: 5, name: "Kệ", createdAt: "2025-09-01" },
    { id: 6, name: "Đèn", createdAt: "2025-09-01" },
  ];
  const categories: CategoryWithIcon[] = rawCategories.map(mapCategoryWithIcon);

  // mock inventory
  const initialInventory: UserInventory = {
    userId: "u1",
    items: [
      {
        id: 1,
        quantity: 2,
        item: {
          id: 1,
          name: "Khung 1",
          puzzlePrice: 100,
          categoryId: 1,
          imageUrl: require("../../assets/frames/frame-circle.png"),
          createdAt: "2025-09-01",
        },
      },
      {
        id: 2,
        quantity: 4,
        item: {
          id: 2,
          name: "Khung 2",
          puzzlePrice: 120,
          categoryId: 1,
          imageUrl: require("../../assets/frames/frame-tourism-1.png"),
          createdAt: "2025-09-01",
        },
      },
      {
        id: 3,
        quantity: 1,
        item: {
          id: 3,
          name: "Khung 3",
          puzzlePrice: 50,
          categoryId: 1,
          imageUrl: require("../../assets/frames/frame-lace.png"),
          createdAt: "2025-09-01",
        },
      },
      {
        id: 4,
        quantity: 5,
        item: {
          id: 4,
          name: "Sticker Thỏ",
          puzzlePrice: 50,
          categoryId: 2,
          imageUrl: require("../../assets/images/Bunny.png"),
          createdAt: "2025-09-01",
        },
      },
      {
        id: 5,
        quantity: 1,
        item: {
          id: 5,
          name: "Sticker Mây",
          puzzlePrice: 50,
          categoryId: 2,
          imageUrl: require("../../assets/images/Cloud.png"),
          createdAt: "2025-09-01",
        },
      },
    ],
  };

  const [inventory, setInventory] = useState<UserInventory>(initialInventory);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);

  const decreaseQuantity = (itemId: number) => {
    setInventory((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.item.id === itemId && it.quantity > 0
          ? { ...it, quantity: it.quantity - 1 }
          : it
      ),
    }));
  };

  const increaseQuantity = (itemId: number) => {
    setInventory((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.item.id === itemId ? { ...it, quantity: it.quantity + 1 } : it
      ),
    }));
  };

  // filter items theo category + thêm empty slot nếu lẻ
  const filteredItems = useMemo<InventoryList[]>(() => {
    let result: InventoryList[] = inventory.items
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
  }, [selectedCategory, inventory.items]);

  return (
    <InventoryContext.Provider
      value={{
        categories,
        items: filteredItems,
        selectedCategory,
        setSelectedCategory,
        increaseQuantity,
        decreaseQuantity,
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
