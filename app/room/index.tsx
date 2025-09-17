import FontAwesome from "@expo/vector-icons/FontAwesome";
import AddMemoryModal from "@src/components/AddMemoryModal";
import Inventory from "@src/components/Inventory";
import LoadingOverlay from "@src/components/LoadingOverlay";
import RoomMenu from "@src/components/RoomMenu";
import useCustomFonts from "@src/hooks/useCustomFonts";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Room = () => {
  const fontsLoaded = useCustomFonts();
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    console.log("Opening modal");
    setIsModalOpen(true);
  };

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

      {/* Nút Thêm ký ức luôn hiển thị */}
      <Pressable onPress={() => fontsLoaded && setIsModalOpen(true)}>
        <View style={styles.addContainer}>
          <Text
            style={[styles.addText, !fontsLoaded && { fontFamily: undefined }]}
          >
            + Thêm ký ức
          </Text>
        </View>
      </Pressable>

      {/* Modal chỉ hiển thị khi fonts đã load và isModalOpen = true */}
      {fontsLoaded && isModalOpen && (
        <AddMemoryModal visible={true} onClose={() => setIsModalOpen(false)} />
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
  addContainer: {
    position: "absolute",
    backgroundColor: "grey",
    justifyContent: "center",
    top: 20,
    left: 20,
  },
  addText: {
    fontFamily: "Baloo2_medium",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
  },
});

export default Room;
