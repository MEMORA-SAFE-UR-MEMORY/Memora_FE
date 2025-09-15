import { useState, useMemo } from "react";

export interface ShopItem {
  id: number;
  name: string;
  image: any;
  price: number;
  category: string;
}

export const useShopItem = () => {
  const [items] = useState<ShopItem[]>([
    {
      id: 1,
      name: "Sticker thỏ",
      image: require("../../assets/images/Bunny.png"),
      price: 10,
      category: "Động vật",
    },
    {
      id: 2,
      name: "Sticker gấu",
      image: require("../../assets/images/Bear.png"),
      price: 10,
      category: "Động vật",
    },
    {
      id: 3,
      name: "Sticker cún",
      image: require("../../assets/images/Dog.png"),
      price: 10,
      category: "Động vật",
    },
    {
      id: 4,
      name: "Sticker hoa",
      image: require("../../assets/images/Flower.png"),
      price: 10,
      category: "Hoa",
    },
    {
      id: 5,
      name: "Sticker bút chì",
      image: require("../../assets/images/Pencil.png"),
      price: 10,
      category: "Đồ dùng",
    },
    {
      id: 6,
      name: "Sticker thước kẻ",
      image: require("../../assets/images/Ruler.png"),
      price: 10,
      category: "Đồ dùng",
    },
    {
      id: 7,
      name: "Sticker ông mặt trời",
      image: require("../../assets/images/Sun.png"),
      price: 10,
      category: "Thiên nhiên",
    },
    {
      id: 8,
      name: "Sticker mây",
      image: require("../../assets/images/Cloud.png"),
      price: 10,
      category: "Thiên nhiên",
    },
    {
      id: 9,
      name: "Sticker chuông",
      image: require("../../assets/images/bell.png"),
      price: 10,
      category: "Giáng sinh",
    },
    {
      id: 10,
      name: "Sticker cầu pha lê",
      image: require("../../assets/images/crystal-ball.png"),
      price: 10,
      category: "Giáng sinh",
    },
    {
      id: 11,
      name: "Sticker gậy kẹo",
      image: require("../../assets/images/candy-cane.png"),
      price: 10,
      category: "Giáng sinh",
    },
    {
      id: 12,
      name: "Sticker kẹo giáng sinh",
      image: require("../../assets/images/christmas-candy.png"),
      price: 10,
      category: "Giáng sinh",
    },
  ]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(items.map((item) => item.category));
    return ["All", ...Array.from(uniqueCategories)];
  }, [items]);

  const getItemsByCategory = (category: string) => {
    if (category === "All") return items;
    return items.filter((item) => item.category === category);
  };

  const searchItems = (query: string) => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    items,
    categories,
    getItemsByCategory,
    searchItems,
  };
};
