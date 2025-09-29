import { useCategories } from "@src/hooks/useCategories";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LoadingOverlay from "./LoadingOverlay";
import { MaterialIcons } from "@expo/vector-icons";

type CategoryFilterBarType = {
  selectedCategory: number;
  setSelectedCategory: (id: number) => void;
};
const CategoryFilterBar = ({
  selectedCategory,
  setSelectedCategory,
}: CategoryFilterBarType) => {
  const iconMap: Record<number, string> = {
    1: "filter-frames", // id=1 Khung
    2: "emoji-objects", // id=2 Vật trang trí
    3: "collections", // id=3 Gói chủ đề
  };

  const { categories, loading, error, fetchCategories, getCategoryName } =
    useCategories();

  const extendedCategories = [{ id: 0, name: "Tất cả" }, ...categories];

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
      }}
    >
      {extendedCategories.map((cat) => {
        const isSelected = selectedCategory === cat.id;

        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <View
              key={cat.id}
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              {isSelected && (
                <View
                  style={{
                    width: 90,
                    height: 24,
                    borderRadius: 99,
                    backgroundColor: "white",
                    position: "absolute",
                    top: -5,
                    zIndex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#D6B7FF",
                      marginTop: 4,
                      fontSize: 14,
                    }}
                  >
                    {cat.name}
                  </Text>
                </View>
              )}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 56,
                  height: 56,
                  borderRadius: 50,
                  backgroundColor: isSelected ? "#D6B7FF" : "transparent",
                }}
              >
                {cat.id === 0 ? (
                  <MaterialIcons name="all-inclusive" size={40} color="white" />
                ) : (
                  <MaterialIcons
                    name={iconMap[cat.id] || "category"}
                    size={40}
                    color="white"
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CategoryFilterBar;
