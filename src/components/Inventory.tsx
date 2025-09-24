import Ionicons from "@expo/vector-icons/Ionicons";
import CategoryInven from "@src/components/CategoryInven";
import { useInventory } from "@src/context/InventoryContext";
import { InventoryItem, InventoryList } from "@src/types/item";
import { useEffect, useRef } from "react";
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type InventoryProps = {
  onClose: () => void;
  onItemSelect: (inventoryItem: InventoryItem) => void;
  onGoToShop: () => void;
};

const Inventory = ({ onClose, onItemSelect, onGoToShop }: InventoryProps) => {
  const { width, height } = useWindowDimensions();
  const { categories, items, selectedCategory, setSelectedCategory } =
    useInventory();

  const inventoryWidth = width * 0.35;
  const slideAnim = useRef(new Animated.Value(inventoryWidth)).current;
  const listRef = useRef<FlatList<InventoryList>>(null);

  useEffect(() => {
    slideAnim.setValue(inventoryWidth);
  }, [width]);

  // slide in khi mount
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: inventoryWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setSelectedCategory(1); 
        onClose();
      }
    });
  };

  const handleItemPress = (inventoryItem: InventoryItem) => {
    if (inventoryItem.quantity > 0) {
      onItemSelect(inventoryItem);
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: InventoryList;
    index: number;
  }) => {
    if ("empty" in item) {
      return (
        <View
          style={[styles.cardContainer, { backgroundColor: "transparent" }]}
        />
      );
    }

    return (
      <Pressable
        onPress={() => handleItemPress(item)}
        style={({ pressed }) => [
          styles.cardContainer,
          pressed && styles.pressed,
          item.quantity === 0 && { opacity: 0.5 },
        ]}
        disabled={item.quantity === 0}
      >
        <Image source={item.item.imageUrl} style={styles.cardImage} />
        <Text
          style={[
            styles.quantityText,
            item.quantity === 0 && { color: "#ccc" },
          ]}
        >
          x{item.quantity}
        </Text>
        <Text
          style={[styles.cardText, item.quantity === 0 && { color: "#ccc" }]}
        >
          {item.item.name}
        </Text>
      </Pressable>
    );
  };

  const keyExtractor = (item: InventoryList) => {
    if ("empty" in item) return item.id;
    return `${item.item.id}-${item.quantity}`;
  };

  const isEmpty = items.length === 0;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          width: inventoryWidth,
          height: height,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <View style={styles.headerContainer}>
        <CategoryInven
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={(id) => {
            setSelectedCategory(id);
            setTimeout(() => {
              listRef.current?.scrollToOffset({ offset: 0, animated: true });
            }, 100);
          }}
        />

        <Pressable onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close-circle" size={28} color="white" />
        </Pressable>
      </View>

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="exclamation" size={35} color="#888" />
          <Text style={styles.emptyText}>Không có item nào</Text>
          <TouchableOpacity onPress={onGoToShop} style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Đến Store</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ padding: 10 }}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          extraData={items}
          removeClippedSubviews={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#fff",
    zIndex: 100,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#E9D8FF",
  },
  closeButton: {
    padding: 2,
    backgroundColor: "#D6B7FF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  cardContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#F8F2EF",
    borderRadius: 25,
    alignItems: "center",
    height: 130,
  },
  pressed: {
    backgroundColor: "#EADBD6",
    transform: [{ scale: 0.95 }],
  },
  cardImage: {
    width: "80%",
    height: "70%",
    resizeMode: "contain",
  },
  cardText: {
    fontSize: 13,
    textAlign: "center",
    fontFamily: "Baloo2_medium",
    marginTop: -5,
  },
  quantityText: {
    fontSize: 11,
    fontFamily: "Baloo2_medium",
    marginTop: 5,
    color: "#888",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Baloo2_medium",
    color: "#888",
    marginBottom: 10,
    marginTop: 10,
  },
  shopButton: {
    backgroundColor: "#D6B7FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  shopButtonText: {
    color: "white",
    fontFamily: "Baloo2_medium",
    fontSize: 14,
  },
});

export default Inventory;
