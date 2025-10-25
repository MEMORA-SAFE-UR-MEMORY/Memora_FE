import CategoryFilterBar from "@src/components/CategoryFilterBar";
import ConfirmBuyModal from "@src/components/ConfirmModal";
import CustomAlert from "@src/components/CustomAlert";
import ExitShopButton from "@src/components/ExitShopButton";
import ItemDetail from "@src/components/ItemDetail";
import ShopItemList from "@src/components/ShopItemList";
import { useInventory as useInventoryContext } from "@src/context/InventoryContext";
import { useInventory } from "@src/hooks/useInventories";
import { useInventoryItems } from "@src/hooks/useInventoryItems";
import { useWallet } from "@src/hooks/useWallet";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

const Shop = () => {
  const [category, setCategory] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState();
  const { wallet, deductWallet } = useWallet();
  const [showConfirm, setShowConfirm] = useState(false);
  const { inventoryId, loading, error } = useInventory();
  const { addItemToInventory } = useInventoryItems();
  const [showAlert, setShowAlert] = useState(false);
  const { refreshInventory } = useInventoryContext();

  const handleAdd = async () => {
    const result = await addItemToInventory(inventoryId, selectedItem?.id, 1);
    const deductResult = await deductWallet(selectedItem?.puzzle_price);
    if (result && deductResult.success) {
      await refreshInventory();
      setShowAlert(true);
    } // 🔹 hiện alert khi thành công }
  };

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
  };

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <CustomAlert
        visible={showAlert}
        onClose={() => setShowAlert(false)}
        message={`Bạn đã mua thành công ${selectedItem?.name}!`}
      />
      <ConfirmBuyModal
        visible={showConfirm}
        itemName={selectedItem?.name}
        price={selectedItem?.puzzle_price}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          handleAdd();
          setShowConfirm(false);
        }}
      />

      <View
        style={{
          width: "40%",
        }}
      >
        <ScrollView>
          <ItemDetail
            setShowConfirm={() => setShowConfirm(true)}
            selectedItem={selectedItem}
          />
        </ScrollView>
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
          <View
            style={{
              height: 34,
              width: 98,
              backgroundColor: "#FFFFFF",
              borderColor: "#663530",
              borderWidth: 2,
              borderRadius: 40,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 12,
              shadowColor: "#663530",
              shadowOpacity: 0.25,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
              marginLeft: 16,
              position: "relative",
            }}
          >
            <Image
              source={require("../../assets/icons/money.png")}
              style={{
                width: 50,
                height: 50,
                position: "absolute",
                left: -30,
                top: -10,
                transform: [{ rotate: "-30deg" }],
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: 16,
                color: "#663530",
                fontFamily: "Baloo2_semiBold",
              }}
            >
              {wallet?.puzzles}
            </Text>
          </View>
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
