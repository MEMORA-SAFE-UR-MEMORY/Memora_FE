import { EmptyItem, Item, RealItem } from "@src/types/item";
import { useMemo, useState } from "react";

const useInventory = () => {
  const categories = [
    {
      id: 1,
      name: "Khung",
      iconPackage: "MaterialCommunityIcons",
      iconName: "image-frame",
    },
    {
      id: 2,
      name: "Sticker",
      iconPackage: "MaterialCommunityIcons",
      iconName: "sticker-emoji",
    },
    {
      id: 3,
      name: "Tường",
      iconPackage: "MaterialCommunityIcons",
      iconName: "mirror-variant",
    },
    { id: 4, name: "Sàn", iconPackage: "FontAwesome6", iconName: "chair" },
    {
      id: 5,
      name: "Kệ",
      iconPackage: "MaterialCommunityIcons",
      iconName: "bookshelf",
    },
    { id: 6, name: "Đèn", iconPackage: "FontAwesome6", iconName: "lightbulb" },
  ];

  const items: RealItem[] = [
    {
      id: "1",
      categoryId: 1,
      name: "Khung 1",
      url: require("../../assets/images/Frame_1.png"),
    },
    {
      id: "2",
      categoryId: 1,
      name: "Khung 2",
      url: require("../../assets/images/Frame_2.png"),
    },
    {
      id: "3",
      categoryId: 1,
      name: "Khung 3",
      url: require("../../assets/images/Frame_3.png"),
    },
    {
      id: "4",
      categoryId: 1,
      name: "Khung 4",
      url: require("../../assets/images/Frame_4.png"),
    },
    {
      id: "5",
      categoryId: 2,
      name: "Sticker Thỏ",
      url: require("../../assets/images/Bunny.png"),
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<number>(1);

  const filteredItems = useMemo<Item[]>(() => {
    let result: Item[] = items.filter(
      (it): it is RealItem => it.categoryId === selectedCategory
    );

    if (result.length % 2 !== 0) {
      const empty: EmptyItem = { id: `empty-${selectedCategory}`, empty: true };
      result = [...result, empty];
    }

    return result;
  }, [selectedCategory]);

  return {
    categories,
    items: filteredItems,
    selectedCategory,
    setSelectedCategory,
  };
};

export default useInventory;
