import { Entypo } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type Category = {
  id: number;
  name: string;
  iconPackage: string;
  iconName: string;
};

type Props = {
  categories: Category[];
  selectedCategory: number;
  onSelect: (id: number) => void;
};

const iconComponents: Record<string, any> = {
  MaterialCommunityIcons,
  FontAwesome6,
  MaterialIcons,
  Ionicons,
};

const CategoryInven = ({ categories, selectedCategory, onSelect }: Props) => {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);

  const handleScrollRight = () => {
    scrollRef.current?.scrollTo({ x: 100, animated: true });
  };

  return (
    <View style={[styles.scrollWrapper, { maxWidth: width * 0.26 }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => {
          const IconComponent = iconComponents[category.iconPackage];
          const isSelected = selectedCategory === category.id;

          return (
            <Pressable
              key={category.id}
              style={styles.categoryItem}
              onPress={() => onSelect(category.id)}
            >
              <View
                style={[isSelected ? styles.iconWrapper : styles.iconContainer]}
              >
                <IconComponent
                  name={category.iconName}
                  size={27}
                  color="white"
                />
              </View>
              {isSelected && (
                <View style={styles.textOverlayWrapper}>
                  <View style={styles.textOverlayContainer}>
                    <Text
                      style={styles.textOverlay}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {category.name}
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Nút play */}
      <Pressable
        style={{ alignSelf: "center", marginLeft: 5, marginBottom: 20, }}
        onPress={handleScrollRight}
      >
        <View style={{ position: "relative" }}>
          <Entypo name="controller-play" size={28} color="white" />
          <Entypo
            name="controller-play"
            size={24}
            color="#D6B7FF"
            style={{ position: "absolute", top: 2, left: 1.9 }}
          />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryContainer: {
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: 15,
    position: "relative",
    height: 55,
  },
  categoryText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Baloo2_medium",
    maxWidth: 70,
  },
  iconContainer: {
    marginTop: 8,
    height: 30,
    alignItems: "center",
  },
  iconWrapper: {
    height: 50,
    width: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D6B7FF",
    paddingBottom: 10,
  },
  textOverlayWrapper: {
    position: "absolute",
    top: 35,
    // Sử dụng left/right thay vì left: 0, right: 0 để text có thể vượt ra ngoài
    left: -50, // Cho phép text mở rộng sang trái
    right: -50, // Cho phép text mở rộng sang phải
    alignItems: "center",
    zIndex: 10,
  },
  textOverlayContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 8,
    alignSelf: "center",
  },
  textOverlay: {
    fontSize: 12,
    fontFamily: "Baloo2_medium",
    color: "#D6B7FF",
    textAlign: "center",
  },
});

export default CategoryInven;
