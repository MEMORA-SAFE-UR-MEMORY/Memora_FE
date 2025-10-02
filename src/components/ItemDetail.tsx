import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ImagePreloader from "./ImagePreloader";

type ItemDetailType = {
  selectedItem: any;
  setShowConfirm: () => void;
};

const ItemDetail = ({ selectedItem, setShowConfirm }: ItemDetailType) => {
  const handleBuy = () => {
    setShowConfirm();
  };
  if (!selectedItem || selectedItem.type === "theme") {
    return (
      <View style={[styles.container, styles.emptyState]}>
        <Text style={styles.emptyText}>Chọn một món đồ để xem chi tiết</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* <ImagePreloader uris={selectedItem?.item_image_path} /> */}
      {/* Hình ảnh item */}
      <Image
        source={{ uri: selectedItem?.item_image_path }}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Tên item */}
      <Text style={styles.name}>{selectedItem?.name}</Text>

      {/* Mô tả */}
      <Text style={styles.desc}>{selectedItem?.type}</Text>

      {/* Giá tiền */}
      <TouchableOpacity style={styles.priceRow} onPress={handleBuy}>
        <Text style={styles.price}>{selectedItem?.puzzle_price}</Text>
        <View>
          <Image
            source={require("../../assets/icons/money.png")}
            style={{
              width: 30,
              height: 30,
              transform: [{ rotate: "-30deg" }],
              marginBottom: 3,
            }}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Baloo2-Bold",
  },
  desc: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    padding: 10,
    fontFamily: "Baloo2-Regular",
  },
  priceRow: {
    width: 100,
    height: 30,
    backgroundColor: "#E9D8FF",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    fontFamily: "Baloo2-Bold",
  },
  buyBtn: {
    backgroundColor: "#E9D8FF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buyText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Baloo2-Bold",
  },
  emptyState: {
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "Baloo2-Regular",
  },
});

export default ItemDetail;
