import CategoryFilterBar from "@src/components/CategoryFilterBar";
import ExitShopButton from "@src/components/ExitShopButton";
import ShopItemList from "@src/components/ShopItemList";
import { useState } from "react";
import { View } from "react-native";

const Shop = () => {
  const [category, setCategory] = useState<number>(0);
  return (
    <View
      style={{
        flex: 1,
        width: "67%",
        backgroundColor: "white",
        alignSelf: "flex-end",
      }}
    >
      <View
        style={{
          flex: 0.18,
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
        <View style={{}}>
          <ExitShopButton />
        </View>
      </View>
      <View>
        <ShopItemList category={category} />
      </View>
    </View>
  );
};

export default Shop;
