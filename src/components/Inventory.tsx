import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  FlatList,
  Image,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import useInventory from "@src/hooks/useInventory";
import { Item } from "@src/types/item";
import CategoryInven from "@src/components/CategoryInven";

const { height, width } = Dimensions.get("window");

type InventoryProps = {
  onClose: () => void;
};

const Inventory = ({ onClose }: InventoryProps) => {
  const { categories, items, selectedCategory, setSelectedCategory } =
    useInventory();

  const slideAnim = useRef(new Animated.Value(width * 0.35)).current;
  const listRef = useRef<FlatList<Item>>(null);

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
      toValue: width * 0.35,
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
          <Entypo name="circle-with-cross" size={25} color="white" />
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
    width: width * 0.35,
    height: height,
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
    padding: 4,
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
