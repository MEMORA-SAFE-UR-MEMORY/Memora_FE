import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AddMemoryModal from "@src/components/AddMemoryModal";
import Inventory from "@src/components/Inventory";
import LoadingOverlay from "@src/components/LoadingOverlay";
import MemoryModal from "@src/components/MemoryModal";
import RoomMenu from "@src/components/RoomMenu";
import useCustomFonts from "@src/hooks/useCustomFonts";
import { useMemory } from "@src/hooks/useMemory";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RoomContent = () => {
  const fontsLoaded = useCustomFonts();
  const {
    modalType,
    selectedMemory,
    openModal,
    closeModal,
    saveMemory,
    updateMemory,
    deleteMemory,
  } = useMemory();
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

      {/* Nút Thêm ký ức luôn hiển thị */}
      <View style={styles.addContainerWrapper}>
        <Pressable
          onPress={openModal}
          style={({ pressed }) => [
            styles.pressableArea,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.addContainer}>
            {selectedMemory?.image ? (
              <Image
                source={{ uri: selectedMemory.image }}
                style={styles.memoryImage}
                resizeMode="cover"
              />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="image-plus"
                  size={24}
                  color="black"
                  style={styles.addIcon}
                />
                <Text style={styles.addText}>Thêm kỷ niệm</Text>
              </>
            )}
          </View>
        </Pressable>
      </View>

      {fontsLoaded && modalType === "add" && (
        <AddMemoryModal
          visible={true}
          onClose={closeModal}
          onSave={saveMemory}
        />
      )}

      {fontsLoaded && modalType === "view" && selectedMemory && (
        <MemoryModal
          onClose={closeModal}
          memory={selectedMemory}
          onUpdate={updateMemory}
          onDelete={deleteMemory}
        />
      )}
    </View>
  );
};

const Room = () => {
  if (Platform.OS === "ios") {
    return (
      <SafeAreaProvider>
        <RoomContent />
      </SafeAreaProvider>
    );
  }
  return <RoomContent />;
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
  addContainerWrapper: {
    position: "absolute",
    top: 50,
    left: 100,
    padding: 10,
  },
  pressableArea: {
    padding: 10,
  },
  pressed: {
    opacity: 0.8,
  },
  addContainer: {
    backgroundColor: "#EDE7E7",
    justifyContent: "center",
    borderColor: "#DCCCEC",
    borderWidth: 5,
    height: 200,
    width: 150,
  },
  addIcon: {
    marginHorizontal: "auto",
  },
  addText: {
    fontFamily: "Baloo2_semiBold",
    fontSize: 12,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
  },
  memoryImage: {
    width: "100%",
    height: "100%",
  },
});

export default Room;
