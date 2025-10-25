import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    paddingVertical: 30,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  name: {
    fontSize: 18,
    fontFamily: "Baloo2_semiBold",
  },
  desc: {
    fontSize: 12,
    textAlign: "center",
    color: "#504f4fff",

    fontFamily: "Baloo2_semiBold",
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
    marginLeft: 8,
    fontFamily: "Baloo2_semiBold",
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
    fontFamily: "Baloo2_semiBold",
  },
  emptyState: {
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "Baloo2_semiBold",
  },
});

export default ItemDetail;
