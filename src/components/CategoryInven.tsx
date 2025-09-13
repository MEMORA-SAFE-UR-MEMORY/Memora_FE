import React, { useRef } from "react";
import {
  ScrollView,
  Pressable,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

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
  const scrollRef = useRef<ScrollView>(null);

  const handleScrollRight = () => {
    scrollRef.current?.scrollTo({ x: 100, animated: true });
  };

  return (
    <View style={styles.scrollWrapper}>
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
              {isSelected ? (
                <View style={styles.textOverlayWrapper}>
                  <Text
                    style={styles.textOverlay}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {category.name}
                  </Text>
                </View>
              ) : (
                <Text
                  style={styles.categoryText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {category.name}
                </Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Nút play */}
      <Pressable
        style={{ alignSelf: "center", marginLeft: 5 }}
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
    maxWidth: width * 0.26,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: 15,
    position: "relative",
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
  },
  iconWrapper: {
    height: 45,
    width: 45,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D6B7FF",
  },
  textOverlayWrapper: {
    position: "absolute",
    top: 38,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 8,
    alignSelf: "center",
    maxWidth: 70,
  },
  textOverlay: {
    fontSize: 12,
    fontFamily: "Baloo2_medium",
    color: "#D6B7FF",
  },
});

export default CategoryInven;
