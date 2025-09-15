import { Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useCustomFonts from "@src/hooks/useCustomFonts";
import LoadingOverlay from "@src/components/LoadingOverlay";
import { router } from "expo-router";
import RoomMenu from "@src/components/RoomMenu";
import Inventory from "@src/components/Inventory";
import { useState } from "react";

const Room = () => {
  const fontsLoaded = useCustomFonts();
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  return (
    <View style={styles.container}>
      {!fontsLoaded && <LoadingOverlay />}
      <View style={styles.bottomContainer}>
        {/* Home */}
        <Pressable
          style={styles.icon}
          onPress={() => {
            router.replace("/");
          }}
        >
          <FontAwesome name="home" size={35} color="white" />
          <Text style={styles.textIcon}>Home</Text>
        </Pressable>

        {/* Menu */}
        <RoomMenu onOpenInventory={() => setIsInventoryOpen(true)} />
      </View>
      {isInventoryOpen && (
        <Inventory onClose={() => setIsInventoryOpen(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bottomContainer: {
    position: "absolute",
    bottom: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  textIcon: {
    marginTop: -8,
    color: "white",
    fontSize: 12,
    fontFamily: "Baloo2_medium",
  },
});

export default Room;
