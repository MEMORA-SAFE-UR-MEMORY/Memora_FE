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
  onItemSelect: (frameUrl: any) => void;
};

const Inventory = ({ onClose, onItemSelect }: InventoryProps) => {
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

  const handleItemPress = (item: Item) => {
    if ("empty" in item) return;

    // Only handle frame items for now
    if (item.categoryId === 1) {
      onItemSelect(item.url);
    }
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
      <Pressable
        onPress={() => handleItemPress(item)}
        style={({ pressed }) => [
          styles.cardContainer,
          pressed && styles.pressed,
        ]}
      >
        <Image source={item.url} style={styles.cardImage} />
        <Text style={styles.cardText}>{item.name}</Text>
      </Pressable>
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
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    fontFamily: "Baloo2_medium",
  },
});

export default Inventory;
