import { useItems } from "@src/hooks/useItems";
import { useEffect } from "react";
import { View } from "react-native";

type ShopItemListType = {
  category: number;
};

const ShopItemList = ({ category }: ShopItemListType) => {
  console.log(category);
  const { items, fetchItems } = useItems();
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  console.log(items);
  return <View></View>;
};

export default ShopItemList;
