import CategoryFilterBar from "@src/components/CategoryFilterBar";
import ExitShopButton from "@src/components/ExitShopButton";
import ItemDetail from "@src/components/ItemDetail";
import ShopItemList from "@src/components/ShopItemList";
import { useWallet } from "@src/hooks/useWallet";
import { useState } from "react";
import { View } from "react-native";

const Shop = () => {
  const [category, setCategory] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState();
  const { wallet } = useWallet();

  const handleSelectItem = (item: any) => {
    console.log(item);
    setSelectedItem(item);
  };
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View
        style={{
          width: "40%",
        }}
      >
        <ItemDetail selectedItem={selectedItem} />
      </View>
      <View
        style={{
          width: "60%",
          backgroundColor: "white",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            height: "18%",
            backgroundColor: "#E9D8FF",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 20,
            paddingHorizontal: 20,
          }}
        >
          <View style={{ flex: 1 }}>
            <CategoryFilterBar
              selectedCategory={category}
              setSelectedCategory={setCategory}
            />
          </View>
          <ExitShopButton />
        </View>
        <View style={{ flex: 1 }}>
          <ShopItemList onSelectItem={handleSelectItem} category={category} />
        </View>
      </View>
    </View>
  );
};

export default Shop;
