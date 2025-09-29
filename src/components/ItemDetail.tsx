import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ImagePreloader from "./ImagePreloader";

type ItemDetailType = {
  selectedItem: any;
};

const ItemDetail = ({ selectedItem }: ItemDetailType) => {
  console.log("selectedItem", selectedItem);
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
      <View style={styles.priceRow}>
        <MaterialCommunityIcons name="puzzle-outline" size={24} color="#444" />
        <Text style={styles.price}>{selectedItem?.puzzle_price}</Text>
      </View>

      {/* Nút mua */}
      <TouchableOpacity style={styles.buyBtn}>
        <Text style={styles.buyText}>Mua ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    padding: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
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
    fontWeight: "bold",
  },
  emptyState: {
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default ItemDetail;
