import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

type RoomMenuProps = {
  onOpenInventory: () => void;
};

const RoomMenu = ({ onOpenInventory }: RoomMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openStore = () => {
    router.push("/store");
  };

  // animated value cho menu (0 = đóng, 1 = mở)
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isMenuOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMenuOpen]);

  // translate cho menu
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0], // menu từ phải trượt vào
  });

  // opacity ngược lại cho icon menu
  const menuIconOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View>
      <Animated.View
        style={[{ opacity: menuIconOpacity }]}
        pointerEvents={isMenuOpen ? "none" : "auto"}
      >
        <Pressable style={styles.menuIcon} onPress={() => setIsMenuOpen(true)}>
          <Entypo name="menu" size={35} color="white" />
          <Text style={styles.menuText}>Menu</Text>
        </Pressable>
      </Animated.View>

      {/* Menu */}
      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateX }], opacity: slideAnim },
        ]}
      >
        <Pressable
          style={{ marginBottom: 10 }}
          onPress={() => setIsMenuOpen(false)}
        >
          <FontAwesome name="play-circle" size={25} color="white" />
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.icon} onPress={openStore}>
          <Ionicons name="storefront" size={35} color="white" />
          <Text style={styles.textIcon}>Store</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.icon} onPress={onOpenInventory}>
          <MaterialIcons name="inventory" size={35} color="white" />
          <Text style={styles.textIcon}>Inventory</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    flexDirection: "column",
    alignItems: "center",
  },
  menuIcon: {
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    right: 0,
    paddingHorizontal: 20,
  },
  menuText: {
    marginTop: -10,
    color: "white",
    fontSize: 12,
    fontFamily: "Baloo2_medium",
  },
  textIcon: {
    marginTop: -5,
    color: "white",
    fontSize: 12,
    fontFamily: "Baloo2_medium",
  },
  menuContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    paddingRight: 20,
  },
  divider: {
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "white",
    marginHorizontal: 5,
    marginBottom: 10,
  },
});

export default RoomMenu;
