import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useCategories } from "@src/hooks/useCategories";
import ShopCategory from "@src/components/ShopCategory";
import { useItems } from "@src/hooks/useItems";
import { useShopItem } from "@src/hooks/useShopItem";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  Dimensions,
  useWindowDimensions,
} from "react-native";

interface ItemDetailProps {
  item: Item;
  visible: boolean;
  onClose: () => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item, visible, onClose }) => {
  const { width } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      supportedOrientations={["landscape", "portrait"]}
    >
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            isLandscape && styles.modalContentLandscape,
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>

          <View
            style={[
              styles.modalInner,
              isLandscape && styles.modalInnerLandscape,
            ]}
          >
            <Image
              source={{ uri: item.item_image_path }}
              style={[
                styles.modalImage,
                isLandscape && styles.modalImageLandscape,
              ]}
              resizeMode="contain"
            />

            <View style={styles.modalInfo}>
              <Text style={styles.modalTitle}>{item.name}</Text>
              <Text style={styles.modalDescription}>{item.type}</Text>

              {item.puzzle_price && (
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Giá mảnh ghép:</Text>
                  <Text style={styles.priceValue}>
                    {item.puzzle_price} mảnh
                  </Text>
                </View>
              )}

              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Mua ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Add category icon mapping
const categoryIcons = {
  1: "image-frame", // Frame icon for category 1
  2: "palette", // Decorator icon for category 2
  // Add more icons as needed
};

const Shop = () => {
  const { width } = useWindowDimensions();
  const { items, loading, error, fetchItems } = useItems();
  const { categories, fetchCategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [fetchItems, fetchCategories]);

  const filteredItems = items.filter(
    (item) => item.category_id === selectedCategory
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => setSelectedItem(item)}
    >
      <Image
        source={{ uri: item.item_image_path }}
        style={styles.itemImage}
        resizeMode="contain"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.puzzle_price && (
          <Text style={styles.puzzlePrice}>{item.puzzle_price} mảnh</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.leftPanel}>
        {selectedItem ? (
          <View style={styles.itemDetail}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedItem(null)}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Image
              source={{ uri: selectedItem.item_image_path }}
              style={styles.detailImage}
              resizeMode="contain"
            />

            <Text style={styles.detailTitle}>{selectedItem.name}</Text>
            <Text style={styles.detailDescription}>{selectedItem.type}</Text>

            {selectedItem.puzzle_price && (
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Giá mảnh ghép:</Text>
                <Text style={styles.priceValue}>
                  {selectedItem.puzzle_price} mảnh
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Mua ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>
              Chọn một món đồ để xem chi tiết
            </Text>
          </View>
        )}
      </View>

      <View style={styles.rightPanel}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <MaterialIcons
                name={categoryIcons[category.id] as any}
                size={24}
                color={selectedCategory === category.id ? "#000" : "#666"}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id &&
                    styles.selectedCategoryText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.itemsGrid}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
  },
  leftPanel: {
    width: "35%",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  rightPanel: {
    width: "65%",
    padding: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    gap: 8,
  },
  selectedCategory: {
    backgroundColor: "#A6E3FF",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  selectedCategoryText: {
    color: "#000",
  },
  itemCard: {
    flex: 1,
    margin: 8,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: "100%",
    height: 120,
    marginBottom: 8,
  },
  itemInfo: {
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  itemType: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  puzzlePrice: {
    fontSize: 14,
    color: "#FF9900",
    fontWeight: "600",
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "80%",
    alignItems: "center",
  },
  modalContentLandscape: {
    height: "100%",
    width: "50%",
    alignSelf: "flex-end",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    zIndex: 1,
  },
  modalInner: {
    width: "100%",
    alignItems: "center",
  },
  modalInnerLandscape: {
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  modalImage: {
    width: "80%",
    height: 200,
    marginTop: 40,
  },
  modalImageLandscape: {
    width: "45%",
    height: "80%",
    marginTop: 0,
    marginRight: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 20,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  priceLabel: {
    fontSize: 16,
    color: "#666",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF9900",
  },
  buyButton: {
    backgroundColor: "#A6E3FF",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 30,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  categoriesLandscape: {
    position: "absolute",
    left: 20,
    top: 20,
    flexDirection: "column",
    gap: 10,
    zIndex: 1,
  },
  itemDetail: {
    padding: 20,
    alignItems: "center",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 20,
    zIndex: 1,
  },
  detailImage: {
    width: "80%",
    height: "40%",
    marginTop: 40,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 20,
    textAlign: "center",
  },
  detailDescription: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  placeholderContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default Shop;
