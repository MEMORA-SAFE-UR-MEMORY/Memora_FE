// context/InventoryContext.tsx
import { InventoryService } from "@src/services/inventoryService";
import { Category, CategoryWithIcon } from "@src/types/category";
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
  const initialInventory: InventoryItem[] = [
    {
      id: 1,
      quantity: 2,
      item: {
        id: 1,
        name: "Khung 1",
        puzzlePrice: 100,
        categoryId: 1,
        type: "frame",
        imageUrl: require("../../assets/images/frames/frame-circle.png"),
        dimension: {
          id: 21,
          w: 150,
          h: 150,
        },
        slots: [
          {
            slotId: 1,
            x: 0,
            y: 0,
            w: 150,
            h: 150,
            shape: { type: "circle", cx: 75, cy: 75, r: 62 },
          },
        ],
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
        type: "frame",
        imageUrl: require("../../assets/images/frames/frame-tourism-1.png"),
        dimension: {
          id: 20,
          w: 140,
          h: 160,
        },
        slots: [
          {
            slotId: 1,
            x: 17,
            y: 11,
            w: 105,
            h: 135,
            shape: {
              type: "rect",
              x: 0,
              y: 0,
              w: 105,
              h: 135,
            },
          },
        ],
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
        type: "frame",
        imageUrl: require("../../assets/images/frames/frame-lace.png"),
        dimension: {
          id: 28,
          w: 180,
          h: 150,
        },
        slots: [
          {
            slotId: 1,
            x: 19,
            y: 37,
            w: 142,
            h: 75,
            shape: {
              type: "rect",
              x: 0,
              y: 0,
              w: 142,
              h: 75,
            },
          },
        ],
        createdAt: "2025-09-01",
      },
    },
    {
      id: 8,
      quantity: 4,
      item: {
        id: 8,
        name: "Khung 4",
        puzzlePrice: 120,
        categoryId: 1,
        type: "frame",
        imageUrl: require("../../assets/images/frames/frame-tourism-2.png"),
        dimension: {
          id: 20,
          w: 140,
          h: 160,
        },
        slots: [
          {
            slotId: 1,
            x: 17,
            y: 11,
            w: 105,
            h: 135,
            shape: {
              type: "rect",
              x: 0,
              y: 0,
              w: 105,
              h: 135,
            },
          },
        ],
        createdAt: "2025-09-01",
      },
    },
    {
      id: 9,
      quantity: 4,
      item: {
        id: 9,
        name: "Khung 5",
        puzzlePrice: 120,
        categoryId: 1,
        type: "frame",
        imageUrl: require("../../assets/images/frames/frame-rectangle.png"),
        dimension: {
          id: 22,
          w: 150,
          h: 160,
        },
        slots: [
          {
            slotId: 1,
            x: 35,
            y: 12,
            w: 80,
            h: 135,
            shape: {
              type: "rect",
              x: 0,
              y: 0,
              w: 80,
              h: 135,
            },
          },
        ],
        createdAt: "2025-09-01",
      },
    },
    {
      id: 10,
      quantity: 2,
      item: {
        id: 10,
        name: "Khung 6",
        puzzlePrice: 100,
        categoryId: 1,
        type: "frame",
        imageUrl: require("../../assets/images/frames/frame-clock.png"),
        dimension: {
          id: 27,
          w: 170,
          h: 170,
        },
        slots: [
          {
            slotId: 1,
            x: 0,
            y: 0,
            w: 170,
            h: 170,
            shape: { type: "circle", cx: 85, cy: 85, r: 59 },
          },
        ],
        createdAt: "2025-09-01",
      },
    },
    {
      id: 11,
      quantity: 4,
      item: {
        id: 11,
        name: "Khung 7",
        puzzlePrice: 120,
        categoryId: 1,
        type: "frame",
        imageUrl: require("../../assets/images/frames/frame-noel.png"),
        dimension: {
          id: 21,
          w: 150,
          h: 150,
        },
        slots: [
          {
            slotId: 1,
            x: 13,
            y: 12,
            w: 125,
            h: 128,
            shape: {
              type: "rect",
              x: 0,
              y: 0,
              w: 125,
              h: 128,
              rx: 30,
              ry: 30,
            },
          },
        ],
        createdAt: "2025-09-01",
      },
    },
    {
      id: 12,
      quantity: 2,
      item: {
        id: 12,
        name: "Khung 8",
        puzzlePrice: 100,
        categoryId: 1,
        type: "frame",
        imageUrl: require("../../assets/images/frames/frame-default-2.png"),
        dimension: {
          id: 21,
          w: 150,
          h: 150,
        },
        slots: [
          {
            slotId: 1,
            x: 0,
            y: 0,
            w: 150,
            h: 150,
            shape: { type: "circle", cx: 75, cy: 75, r: 61 },
          },
        ],
        createdAt: "2025-09-01",
      },
    },
    {
      id: 13,
      quantity: 2,
      item: {
        id: 13,
        name: "Khung 9",
        puzzlePrice: 100,
        categoryId: 1,
        type: "frame",
        imageUrl: require("../../assets/images/frames/frame-child.png"),
        dimension: {
          id: 21,
          w: 150,
          h: 150,
        },
        slots: [
          {
            slotId: 1,
            x: 4,
            y: 12,
            w: 132,
            h: 132,
            shape: {
              type: "polygon",
              points:
                "50,15 61,35 84,35 66,50 71,72 50,60 29,72 34,50 16,35 39,35",
            },
          },
        ],
        createdAt: "2025-09-01",
      },
    },
    {
      id: 14,
      quantity: 4,
      item: {
        id: 14,
        name: "Khung 10",
        puzzlePrice: 120,
        categoryId: 1,
        type: "frame",
        imageUrl: require("../../assets/images/frames/frame-default-3.png"),
        dimension: {
          id: 21,
          w: 150,
          h: 150,
        },
        slots: [
          {
            slotId: 1,
            x: 22,
            y: 21,
            w: 108,
            h: 108,
            shape: {
              type: "rect",
              x: 0,
              y: 0,
              w: 108,
              h: 108,
              rx: 5,
              ry: 5,
            },
          },
        ],
        createdAt: "2025-09-01",
      },
    },
    {
      id: 6,
      quantity: 3,
      item: {
        id: 6,
        name: "Chậu cây",
        puzzlePrice: 50,
        categoryId: 4,
        type: "decor",
        imageUrl: require("../../assets/images/items/monstera-plant.png"),
        dimension: {
          id: 13,
          w: 90,
          h: 90,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 7,
      quantity: 3,
      item: {
        id: 7,
        name: "Gấu bông",
        puzzlePrice: 50,
        categoryId: 5,
        type: "decor",
        imageUrl: require("../../assets/images/items/bear.png"),
        dimension: {
          id: 5,
          w: 70,
          h: 100,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 15,
      quantity: 3,
      item: {
        id: 15,
        name: "Dây cờ",
        puzzlePrice: 50,
        categoryId: 3,
        type: "decor",
        imageUrl: require("../../assets/images/items/bunting.png"),
        dimension: {
          id: 31,
          w: 300,
          h: 150,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 16,
      quantity: 3,
      item: {
        id: 16,
        name: "Kẹo cây",
        puzzlePrice: 50,
        categoryId: 2,
        type: "decor",
        imageUrl: require("../../assets/images/items/candy-cane.png"),
        dimension: {
          id: 1,
          w: 50,
          h: 50,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 17,
      quantity: 3,
      item: {
        id: 17,
        name: "Tuần lộc",
        puzzlePrice: 50,
        categoryId: 2,
        type: "decor",
        imageUrl: require("../../assets/images/items/caribou.png"),
        dimension: {
          id: 1,
          w: 50,
          h: 50,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 18,
      quantity: 3,
      item: {
        id: 18,
        name: "Thảm",
        puzzlePrice: 50,
        categoryId: 4,
        type: "decor",
        imageUrl: require("../../assets/images/items/carpet.png"),
        dimension: {
          id: 26,
          w: 170,
          h: 70,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 19,
      quantity: 3,
      item: {
        id: 19,
        name: "Cây thông",
        puzzlePrice: 50,
        categoryId: 4,
        type: "decor",
        imageUrl: require("../../assets/images/items/christmast-tree.png"),
        dimension: {
          id: 29,
          w: 200,
          h: 240,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 20,
      quantity: 3,
      item: {
        id: 20,
        name: "Đồng hồ",
        puzzlePrice: 50,
        categoryId: 3,
        type: "decor",
        imageUrl: require("../../assets/images/items/clock.png"),
        dimension: {
          id: 4,
          w: 70,
          h: 70,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 21,
      quantity: 3,
      item: {
        id: 21,
        name: "Bánh quy",
        puzzlePrice: 50,
        categoryId: 2,
        type: "decor",
        imageUrl: require("../../assets/images/items/cookie.png"),
        dimension: {
          id: 1,
          w: 50,
          h: 50,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 22,
      quantity: 3,
      item: {
        id: 22,
        name: "Ghế mây",
        puzzlePrice: 50,
        categoryId: 4,
        type: "decor",
        imageUrl: require("../../assets/images/items/cotton-chair.png"),
        dimension: {
          id: 21,
          w: 150,
          h: 150,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 23,
      quantity: 3,
      item: {
        id: 23,
        name: "Búp bê",
        puzzlePrice: 50,
        categoryId: 5,
        type: "decor",
        imageUrl: require("../../assets/images/items/doll.png"),
        dimension: {
          id: 7,
          w: 70,
          h: 140,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 24,
      quantity: 3,
      item: {
        id: 24,
        name: "Vòng dreamcatcher",
        puzzlePrice: 50,
        categoryId: 3,
        type: "decor",
        imageUrl: require("../../assets/images/items/dreamcatcher.png"),
        dimension: {
          id: 33,
          w: 60,
          h: 160,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 25,
      quantity: 3,
      item: {
        id: 25,
        name: "Đàn ghita",
        puzzlePrice: 50,
        categoryId: 4,
        type: "decor",
        imageUrl: require("../../assets/images/items/ghita.png"),
        dimension: {
          id: 8,
          w: 70,
          h: 180,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 26,
      quantity: 3,
      item: {
        id: 26,
        name: "Hộp quà đỏ",
        puzzlePrice: 50,
        categoryId: 4,
        type: "decor",
        imageUrl: require("../../assets/images/items/gift-box-1.png"),
        dimension: {
          id: 9,
          w: 80,
          h: 60,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 27,
      quantity: 3,
      item: {
        id: 27,
        name: "Hộp quà xanh lá",
        puzzlePrice: 50,
        categoryId: 4,
        type: "decor",
        imageUrl: require("../../assets/images/items/gift-box-2.png"),
        dimension: {
          id: 19,
          w: 125,
          h: 55,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 28,
      quantity: 3,
      item: {
        id: 28,
        name: "Hộp quà vàng",
        puzzlePrice: 50,
        categoryId: 4,
        type: "decor",
        imageUrl: require("../../assets/images/items/gift-box-3.png"),
        dimension: {
          id: 14,
          w: 100,
          h: 70,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 29,
      quantity: 3,
      item: {
        id: 29,
        name: "Đèn ngủ",
        puzzlePrice: 50,
        categoryId: 6,
        type: "decor",
        imageUrl: require("../../assets/images/items/sleep-lamp.png"),
        dimension: {
          id: 3,
          w: 60,
          h: 70,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 30,
      quantity: 3,
      item: {
        id: 30,
        name: "Gương",
        puzzlePrice: 50,
        categoryId: 4,
        type: "decor",
        imageUrl: require("../../assets/images/items/mirror.png"),
        dimension: {
          id: 17,
          w: 110,
          h: 190,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 31,
      quantity: 3,
      item: {
        id: 31,
        name: "Bảng pin",
        puzzlePrice: 50,
        categoryId: 5,
        type: "decor",
        imageUrl: require("../../assets/images/items/pinboard.png"),
        dimension: {
          id: 18,
          w: 120,
          h: 80,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 32,
      quantity: 3,
      item: {
        id: 32,
        name: "Chậu cây treo",
        puzzlePrice: 50,
        categoryId: 3,
        type: "decor",
        imageUrl: require("../../assets/images/items/plant-hanger.png"),
        dimension: {
          id: 7,
          w: 70,
          h: 140,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 33,
      quantity: 3,
      item: {
        id: 33,
        name: "Cầu vồng",
        puzzlePrice: 50,
        categoryId: 5,
        type: "decor",
        imageUrl: require("../../assets/images/items/rainbow.png"),
        dimension: {
          id: 16,
          w: 110,
          h: 60,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 34,
      quantity: 3,
      item: {
        id: 34,
        name: "Rào chắn",
        puzzlePrice: 50,
        categoryId: 4,
        type: "decor",
        imageUrl: require("../../assets/images/items/rope-barrier.png"),
        dimension: {
          id: 24,
          w: 160,
          h: 120,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 35,
      quantity: 3,
      item: {
        id: 35,
        name: "Đôi dép",
        puzzlePrice: 50,
        categoryId: 4,
        type: "decor",
        imageUrl: require("../../assets/images/items/slipper.png"),
        dimension: {
          id: 10,
          w: 85,
          h: 45,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 36,
      quantity: 3,
      item: {
        id: 36,
        name: "Người tuyết",
        puzzlePrice: 50,
        categoryId: 2,
        type: "decor",
        imageUrl: require("../../assets/images/items/snow-man.png"),
        dimension: {
          id: 1,
          w: 50,
          h: 50,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 37,
      quantity: 3,
      item: {
        id: 37,
        name: "Chiếc tất",
        puzzlePrice: 50,
        categoryId: 2,
        type: "decor",
        imageUrl: require("../../assets/images/items/socks.png"),
        dimension: {
          id: 1,
          w: 50,
          h: 50,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 38,
      quantity: 3,
      item: {
        id: 38,
        name: "Chồng sách",
        puzzlePrice: 50,
        categoryId: 5,
        type: "decor",
        imageUrl: require("../../assets/images/items/stack-of-books.png"),
        dimension: {
          id: 11,
          w: 90,
          h: 50,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 39,
      quantity: 3,
      item: {
        id: 39,
        name: "Dây đèn noel",
        puzzlePrice: 50,
        categoryId: 6,
        type: "decor",
        imageUrl: require("../../assets/images/items/string-light-noel.png"),
        dimension: {
          id: 32,
          w: 350,
          h: 50,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 40,
      quantity: 3,
      item: {
        id: 40,
        name: "Dây đèn",
        puzzlePrice: 50,
        categoryId: 6,
        type: "decor",
        imageUrl: require("../../assets/images/items/string-light.png"),
        dimension: {
          id: 30,
          w: 300,
          h: 90,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 41,
      quantity: 3,
      item: {
        id: 41,
        name: "Cây đèn",
        puzzlePrice: 50,
        categoryId: 6,
        type: "decor",
        imageUrl: require("../../assets/images/items/blue-lamp.png"),
        dimension: {
          id: 25,
          w: 160,
          h: 250,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 42,
      quantity: 3,
      item: {
        id: 42,
        name: "Tàu lửa",
        puzzlePrice: 50,
        categoryId: 4,
        type: "decor",
        imageUrl: require("../../assets/images/items/train.png"),
        dimension: {
          id: 15,
          w: 105,
          h: 65,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 43,
      quantity: 3,
      item: {
        id: 43,
        name: "Vali",
        puzzlePrice: 50,
        categoryId: 4,
        type: "decor",
        imageUrl: require("../../assets/images/items/vali.png"),
        dimension: {
          id: 7,
          w: 70,
          h: 140,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 44,
      quantity: 3,
      item: {
        id: 44,
        name: "Tranh treo tường",
        puzzlePrice: 50,
        categoryId: 3,
        type: "decor",
        imageUrl: require("../../assets/images/items/wall-paintings-1.png"),
        dimension: {
          id: 6,
          w: 70,
          h: 110,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 45,
      quantity: 3,
      item: {
        id: 45,
        name: "Tranh treo tường",
        puzzlePrice: 50,
        categoryId: 3,
        type: "decor",
        imageUrl: require("../../assets/images/items/wall-paintings-2.png"),
        dimension: {
          id: 6,
          w: 70,
          h: 110,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 46,
      quantity: 3,
      item: {
        id: 46,
        name: "Bộ xếp hình gỗ",
        puzzlePrice: 50,
        categoryId: 4,
        type: "decor",
        imageUrl: require("../../assets/images/items/wood-puzzle.png"),
        dimension: {
          id: 12,
          w: 90,
          h: 70,
        },
        createdAt: "2025-09-01",
      },
    },
    {
      id: 47,
      quantity: 3,
      item: {
        id: 47,
        name: "Kệ sách",
        puzzlePrice: 50,
        categoryId: 3,
        type: "decor",
        imageUrl: require("../../assets/images/items/wooden-shelf.png"),
        dimension: {
          id: 23,
          w: 150,
          h: 190,
        },
        createdAt: "2025-09-01",
      },
    },
  ];

  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);

  useEffect(() => {
    InventoryService.initItems(inventory);
  }, [inventory]);

  const decreaseQuantity = (itemId: number) => {
    setInventory((prev) =>
      prev.map((it) =>
        it.item.id === itemId && it.quantity > 0
          ? { ...it, quantity: it.quantity - 1 }
          : it
      )
    );
  };

  const increaseQuantity = (itemId: number) => {
    setInventory((prev) =>
      prev.map((it) =>
        it.item.id === itemId ? { ...it, quantity: it.quantity + 1 } : it
      )
    );
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
