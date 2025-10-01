import { useItems } from "@src/hooks/useItems";
import { useThemes } from "@src/hooks/useThemes";
import { router } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Add theme image mapping
const themeImages = {
  christmas: require("../../assets/images/christmas.png"),
  default: require("../../assets/images/default_theme.jpg"),
};

type ShopItemListType = {
  category: number;
  onSelectItem: (item: any) => void;
};

const ShopItemList = ({ category, onSelectItem }: ShopItemListType) => {
  const { items, fetchItems } = useItems();
  const { themes, loading, error, fetchThemes } = useThemes();

  useEffect(() => {
    fetchItems();
    fetchThemes();
  }, [fetchItems, fetchThemes]);

  console.log(themes);

  console.log(items);

  const filteredItems = useMemo(() => {
    if (category === 3) {
      return themes.map((t) => ({
        ...t,
        type: "theme",
        imagePath: t.theme_name.toLowerCase().includes("giáng sinh")
          ? themeImages.christmas
          : themeImages.default,
        themePath: t.theme_name.toLowerCase().includes("giáng sinh")
          ? "/christmas"
          : null,
      }));
    }
    let result = items.filter((it) => it.theme_id === null);
    if (category === 0) return result; // nếu chưa chọn thì show all
    return result.filter((it) => it.category_id === category);
  }, [items, category, themes]);

  const renderItem = ({ item }: any) => {
    console.log(item);
    if (item.theme_id !== null) {
      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            if (item.themePath) {
              router.push(item.themePath);
            }
          }}
        >
          <Image
            source={item.imagePath}
            style={[styles.image, styles.themeImage]}
          />
          <Text style={styles.name} numberOfLines={1}>
            {item.theme_name}
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onSelectItem?.(item)} // gọi callback
      >
        <Image source={{ uri: item.item_image_path }} style={styles.image} />
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={filteredItems}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      numColumns={4}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#FDF7FF",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginBottom: 6,
  },
  name: {
    fontSize: 20,
    textAlign: "center",
    color: "#444",
  },
  themeImage: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
  },
});

export default ShopItemList;
