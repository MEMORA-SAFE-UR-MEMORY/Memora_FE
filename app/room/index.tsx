// app/room/index.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AddMemoryModal from "@src/components/AddMemoryModal";
import Inventory from "@src/components/Inventory";
import LoadingOverlay from "@src/components/LoadingOverlay";
import MemoryModal from "@src/components/MemoryModal";
import PlacedFrame from "@src/components/PlacedFrame";
import RoomMenu from "@src/components/RoomMenu";
import useCustomFonts from "@src/hooks/useCustomFonts";
import { useMemory } from "@src/hooks/useMemory";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
const Room = () => {
  const fontsLoaded = useCustomFonts();

  const {
    modalType,
    selectedMemory,
    placedItems,
    placedItemMemories,
    closeModal,
    handleItemSelect,
    moveItem,
    handleFramePress,
    handleSaveMemory,
    handleUpdateMemory,
    handleDeleteMemory,
    isInventoryOpen,
    openInventory,
    closeInventory,
    trashLayout,
    setTrashLayout,
    removeItem,
    isTrashActive,
    setIsTrashActive,
    showTrash,
    setShowTrash,
    activeFrameId,
  } = useMemory();

  return (
    <View style={styles.container}>
      {!fontsLoaded && <LoadingOverlay />}

      {/* Render placed frames */}
      {placedItems.map((item) => (
        <PlacedFrame
          key={item.id}
          item={item}
          onMove={moveItem}
          onPress={() => handleFramePress(item.id)}
          onDelete={removeItem}
          trashLayout={trashLayout}
          setTrashActive={setIsTrashActive}
          setShowTrash={setShowTrash}
          memory={placedItemMemories[item.id]}
        />
      ))}

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
        <RoomMenu onOpenInventory={openInventory} />
      </View>

      {/* Trash */}
      {showTrash && (
        <View
          style={[
            styles.trashZone,
            {
              backgroundColor: isTrashActive
                ? "rgba(255,0,0,0.6)"
                : "rgba(255,0,0,0.2)",
            },
          ]}
          onLayout={(e) => {
            const { x, y, width, height } = e.nativeEvent.layout;
            setTrashLayout({ x, y, w: width, h: height });
          }}
        >
          <MaterialCommunityIcons name="trash-can" size={40} color="white" />
        </View>
      )}

      {isInventoryOpen && (
        <Inventory onClose={closeInventory} onItemSelect={handleItemSelect} />
      )}

      {fontsLoaded && modalType === "add" && (
        <AddMemoryModal
          visible={true}
          onClose={closeModal}
          onSave={handleSaveMemory}
        />
      )}

      {modalType === "view" && selectedMemory && (
        <MemoryModal
          visible={true}
          onClose={closeModal}
          memory={selectedMemory}
          onUpdate={handleUpdateMemory}
          onDelete={handleDeleteMemory}
          onFrameRemoved={activeFrameId === null}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 10,
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
    color: "white",
    fontSize: 12,
    marginTop: -8,
    fontFamily: "Baloo2_medium",
  },
  trashZone: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Room;
