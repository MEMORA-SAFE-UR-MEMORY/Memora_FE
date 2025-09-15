import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ShopCategory from "@src/components/ShopCategory";
import { useShopItem } from "@src/hooks/useShopItem";
import { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Shop = () => {
  const puzzle = 10;
  const { items, categories, getItemsByCategory } = useShopItem();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [categoryOpen, setCategoryOpen] = useState(false);

  const filteredItems = getItemsByCategory(selectedCategory);

  const openCategory = () => {
    setCategoryOpen(true);
  };
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View style={{ width: 307, backgroundColor: "#B1E2FF" }}></View>

      <ScrollView
        style={{ width: 624, backgroundColor: "#FEE3F4", paddingTop: 10 }}
      >
        <View style={{ position: "absolute", left: 50, zIndex: 1 }}>
          <Ionicons name="extension-puzzle" size={35} color="#FB8CAC" />
        </View>
        <View
          style={{
            height: 33,
            width: 118,
            backgroundColor: "white",
            borderRadius: 10,
            marginLeft: 60,
            marginTop: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>{puzzle}</Text>
        </View>
        <FlatList
          numColumns={4}
          data={filteredItems}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View>
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 100,
                  backgroundColor: "white",
                  marginHorizontal: 30,
                  marginVertical: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <Image source={item.image} resizeMode="contain" />
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                <Text style={{ fontSize: 20 }}>{item.price}</Text>
                <Ionicons name="extension-puzzle" size={20} color="#FB8CAC" />
              </View>
            </View>
          )}
        />
        <View style={{ height: 70 }}></View>
      </ScrollView>
      <View
        style={{
          width: 624,
          height: 67,
          backgroundColor: "#E9D8FF",
          position: "absolute",
          bottom: 0,
          left: 307,
        }}
      >
        <View
          style={{ position: "absolute", bottom: -15, right: -50, width: 600 }}
        >
          <ShopCategory
            isOpen={categoryOpen}
            onToggle={openCategory}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onClose={() => setCategoryOpen(false)}
          />
        </View>
      </View>
    </View>
  );
};

export default Shop;
