// hooks/useInventory.ts
import { useMemo, useState } from "react";
import { Item, RealItem, EmptyItem } from "@src/types/item";

const useInventory = () => {
  const categories = [
    {
      id: 1,
      name: "Sticker",
      iconPackage: "MaterialCommunityIcons",
      iconName: "sticker-emoji",
    },
    { id: 2, name: "Ảnh", iconPackage: "FontAwesome6", iconName: "image" },
    { id: 3, name: "Ghế", iconPackage: "FontAwesome6", iconName: "chair" },
    { id: 4, name: "Bàn", iconPackage: "MaterialIcons", iconName: "table-bar" },
    { id: 5, name: "Giường", iconPackage: "Ionicons", iconName: "bed" },
  ];

  const items: RealItem[] = [
    {
      id: "1",
      categoryId: 1,
      name: "Sticker 1",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcljdiuUsIN7IXwXrUi9wNozpc6CqR6tNK_g&s",
    },
    {
      id: "2",
      categoryId: 1,
      name: "Sticker 2",
      url: "https://cdn-media.sforum.vn/storage/app/media/ctv_seo3/meme-meo-cuoi-5.jpg",
    },
    {
      id: "3",
      categoryId: 1,
      name: "Sticker 3",
      url: "https://i.pinimg.com/564x/c8/cc/68/c8cc6816a2448d0a03a5e46e932ce7a9.jpg",
    },
    {
      id: "4",
      categoryId: 2,
      name: "Ảnh 1",
      url: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/anh-meo-13.png",
    },
    {
      id: "5",
      categoryId: 2,
      name: "Ảnh 2",
      url: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/03/anh-meo-bua-50.jpg",
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
