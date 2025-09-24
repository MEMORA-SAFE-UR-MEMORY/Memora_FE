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
import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
const Room = () => {
  const fontsLoaded = useCustomFonts();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollX, setScrollX] = useState(0);

  // Room dimensions - 3x wider than screen
  const roomWidth = screenWidth * 3;
  const roomHeight = screenHeight;

  const openStore = () => {
    router.push("/store");
  };

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
  } = useMemory(scrollX);

  return (
    <View style={styles.container}>
      {!fontsLoaded && <LoadingOverlay />}

      {/* Scrollable Room Area */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        style={styles.roomScrollView}
        contentContainerStyle={[styles.roomContent, { width: roomWidth }]}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={(e) => {
          setScrollX(e.nativeEvent.contentOffset.x);
        }}
        scrollEventThrottle={16}
      >
        {/* Room Background */}
        <View style={[{ width: roomWidth, height: roomHeight }]}>
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
              roomWidth={roomWidth}
              roomHeight={roomHeight}
              scrollX={scrollX}
            />
          ))}
        </View>
      </ScrollView>

      {/* Fixed UI Elements */}
      <View style={styles.fixedUIContainer}>
        {/* Bottom UI */}
        <View style={styles.bottomContainer}>
          {/* Home */}
          <Pressable
            style={styles.icon}
            onPress={() => {
              router.replace("/home");
            }}
          >
            <FontAwesome name="home" size={35} color="white" />
            <Text style={styles.textIcon}>Home</Text>
          </Pressable>

          {/* Menu */}
          <RoomMenu onOpenInventory={openInventory} />
        </View>

        {/* Trash (Fixed position) */}
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
              setTrashLayout({
                x: screenWidth / 2 - width / 2,
                y: screenHeight - 60 - height,
                w: width,
                h: height,
              });
            }}
          >
            <MaterialCommunityIcons name="trash-can" size={40} color="white" />
          </View>
        )}
      </View>

      {/* Overlays */}
      {isInventoryOpen && (
        <Inventory
          onClose={closeInventory}
          onItemSelect={handleItemSelect}
          onGoToShop={openStore}
        />
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
  roomScrollView: {
    flex: 1,
  },
  roomContent: {
    minHeight: "100%",
  },
  fixedUIContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "box-none",
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
    width: 70,
    height: 70,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Room;
