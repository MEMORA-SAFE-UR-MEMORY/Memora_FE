import Ionicons from "@expo/vector-icons/Ionicons";
import CategoryInven from "@src/components/CategoryInven";
import useInventory from "@src/hooks/useInventory";
import { Item } from "@src/types/item";
import { useEffect, useRef } from "react";
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type InventoryProps = {
  onClose: () => void;
};

const Inventory = ({ onClose }: InventoryProps) => {
  const { width, height } = useWindowDimensions();
  const { categories, items, selectedCategory, setSelectedCategory } =
    useInventory();

  const inventoryWidth = width * 0.35;
  const slideAnim = useRef(new Animated.Value(inventoryWidth)).current;
  const listRef = useRef<FlatList<Item>>(null);

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
      if (finished) onClose();
    });
  };

  const renderItem = ({ item }: { item: Item }) => {
    if ("empty" in item) {
      return (
        <View
          style={[styles.cardContainer, { backgroundColor: "transparent" }]}
        />
      );
    }

    return (
      <View style={styles.cardContainer}>
        <Image
          source={{ uri: item.url }}
          style={{ width: 100, height: 80, borderRadius: 10 }}
        />
        <Text style={styles.cardText}>{item.name}</Text>
      </View>
    );
  };

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
            listRef.current?.scrollToOffset({ offset: 0, animated: true });
          }}
        />

        <Pressable onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close-circle" size={28} color="white" />
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#E9D8FF",
  },
  closeButton: {
    padding: 2,
    backgroundColor: "#D6B7FF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#F8F2EF",
    borderRadius: 25,
    alignItems: "center",
  },
  cardText: {
    fontFamily: "Baloo2",
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
  },
});

export default Inventory;
