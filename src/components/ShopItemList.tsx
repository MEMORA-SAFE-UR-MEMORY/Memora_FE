import { useItems } from "@src/hooks/useItems";
import { useThemes } from "@src/hooks/useThemes";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "./CustomAlert";

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
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchItems();
    fetchThemes();
  }, [fetchItems, fetchThemes]);

  const filteredItems = useMemo(() => {
    if (category === 3) {
      return themes
        .filter((t) => {
          // Loại bỏ theme mặc định
          const lower = t.theme_name.toLowerCase();
          return !(lower.includes("mặc định") || lower.includes("default"));
        })
        .map((t) => ({
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
    if (item.theme_id !== null) {
      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            if (item.themePath) {
              router.push(item.themePath);
            } else {
              setAlertMessage("Theme này chưa được tạo!");
              setAlertVisible(true);
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
        <CustomAlert
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </TouchableOpacity>
    );
  };
  return (
    <>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={4}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
      />
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </>
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
    fontFamily: "Baloo2-SemiBold",
  },
  themeImage: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
  },
});

export default ShopItemList;
