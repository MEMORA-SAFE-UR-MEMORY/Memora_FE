import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ShopCategoryProps {
  isOpen: boolean;
  onToggle: () => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onClose: () => void;
}

const ShopCategory = ({
  isOpen,
  onToggle,
  categories,
  selectedCategory,
  onSelectCategory,
  onClose,
}: ShopCategoryProps) => {
  const [visible, setVisible] = useState(false);

  // tạo Animated.Value cho từng category
  const itemAnims = useRef(
    categories.map(() => new Animated.Value(50))
  ).current;

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      Animated.stagger(
        100,
        itemAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        )
      ).start();
    } else {
      // animate từng item vào
      Animated.stagger(
        50,
        itemAnims
          .map((anim) =>
            Animated.timing(anim, {
              toValue: 50,
              duration: 200,
              useNativeDriver: true,
            })
          )
          .reverse() // đóng ngược thứ tự
      ).start(() => {
        setVisible(false);
        onClose();
      });
    }
  }, [isOpen]);

  return (
    <View
      style={{
        flexDirection: "row-reverse",
        alignItems: "center",
        position: "absolute",
        right: 60,
        bottom: 15,
      }}
    >
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => {
          if (isOpen) {
            onClose();
          } else {
            onToggle();
          }
        }}
      >
        <MaterialIcons name="category" size={25} color="white" />
      </TouchableOpacity>

      {visible && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", marginRight: 100 }}>
            {categories.map((category, index) => (
              <Animated.View
                key={category}
                style={{
                  transform: [{ translateX: itemAnims[index] }],
                  opacity: itemAnims[index].interpolate({
                    inputRange: [0, 50],
                    outputRange: [1, 0],
                  }),
                  marginHorizontal: 10,
                  marginBottom: 17,
                }}
              >
                <TouchableOpacity
                  onPress={() => onSelectCategory(category)}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category && styles.selectedCategory,
                  ]}
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    width: 37,
    height: 37,
    backgroundColor: "#D6B7FF",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 60,
    bottom: 15,
    zIndex: 2,
  },
  row: { flexDirection: "row" },
  categoryItem: {
    minWidth: 70,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#D6B7FF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCategory: {
    backgroundColor: "white",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "black",
  },
});

export default ShopCategory;
