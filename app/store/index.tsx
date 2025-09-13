import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { FlatList, Image, ScrollView, Text, View } from "react-native";

const Shop = () => {
  const puzzle = 10;
  const shopItem = [
    {
      id: 1,
      name: "Sticker thỏ",
      image: require("../../assets/images/Bunny.png"),
      price: 10,
      category: "Sticker",
    },
    {
      id: 2,
      name: "Sticker gấu",
      image: require("../../assets/images/Bear.png"),
      price: 10,
      category: "Sticker",
    },
    {
      id: 3,
      name: "Sticker cún",
      image: require("../../assets/images/Dog.png"),
      price: 10,
      category: "Sticker",
    },
    {
      id: 4,
      name: "Sticker hoa",
      image: require("../../assets/images/Flower.png"),
      price: 10,
      category: "Sticker",
    },
    {
      id: 5,
      name: "Sticker bút chì",
      image: require("../../assets/images/Pencil.png"),
      price: 10,
      category: "Sticker",
    },
    {
      id: 6,
      name: "Sticker thước kẻ",
      image: require("../../assets/images/Ruler.png"),
      price: 10,
      category: "Sticker",
    },
    {
      id: 7,
      name: "Sticker ông mặt trời",
      image: require("../../assets/images/Sun.png"),
      price: 10,
      category: "Sticker",
    },
    {
      id: 8,
      name: "Sticker mây",
      image: require("../../assets/images/Cloud.png"),
      price: 10,
      category: "Sticker",
    },
    {
      id: 9,
      name: "Sticker chuông",
      image: require("../../assets/images/bell.png"),
      price: 10,
      category: "Sticker",
    },
    {
      id: 10,
      name: "Sticker cầu pha lê",
      image: require("../../assets/images/crystal-ball.png"),
      price: 10,
      category: "Sticker",
    },
    {
      id: 11,
      name: "Sticker gậy kẹo",
      image: require("../../assets/images/candy-cane.png"),
      price: 10,
      category: "Sticker",
    },
    {
      id: 12,
      name: "Sticker kẹo giáng sinh",
      image: require("../../assets/images/christmas-candy.png"),
      price: 10,
      category: "Sticker",
    },
  ];
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
          data={shopItem}
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
        <MaterialIcons name="category" size={24} color="black" />
      </View>
    </View>
  );
};

export default Shop;
