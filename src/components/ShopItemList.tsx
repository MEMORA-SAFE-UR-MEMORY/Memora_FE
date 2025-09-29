import { useItems } from "@src/hooks/useItems";
import { useThemes } from "@src/hooks/useThemes";
import { useEffect, useMemo } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
      // hiển thị theme
      return themes.map((t) => ({
        ...t,
        type: "theme", // gắn nhãn để phân biệt khi render
      }));
    }
    let result = items.filter((it) => it.theme_id === null);
    if (category === 0) return result; // nếu chưa chọn thì show all
    return result.filter((it) => it.category_id === category);
  }, [items, category, themes]);

  const renderItem = ({ item }: any) => {
    if (item.type === "theme") {
      // render theme card
      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => onSelectItem?.(item)}
        >
          {/* có thể thay bằng icon hoặc hình mặc định cho theme */}
          <Image style={styles.image} />
          <Text style={styles.name} numberOfLines={1}>
            {item.theme_name}
          </Text>
          <Text style={{ fontSize: 10, color: "#888" }}>
            {item.theme_price}đ
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
    fontSize: 12,
    textAlign: "center",
    color: "#444",
  },
});

export default ShopItemList;
