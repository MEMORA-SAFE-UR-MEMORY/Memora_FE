import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AddMemoryModal from "@src/components/AddMemoryModal";
import Inventory from "@src/components/Inventory";
import LoadingOverlay from "@src/components/LoadingOverlay";
import MemoryModal from "@src/components/MemoryModal";
import PlacedFrame from "@src/components/PlacedFrame";
import RoomMenu from "@src/components/RoomMenu";
import { useRoomDraftContext } from "@src/context/DraftContext";
import { useRoomContext } from "@src/context/RoomContext";
import useCustomFonts from "@src/hooks/useCustomFonts";
import { useMemory } from "@src/hooks/useMemory";
import { useRoom } from "@src/hooks/useRoom";
import { RoomDetail } from "@src/types/room";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const Room = () => {
  const { roomId, themeId, type } = useRoomContext();
  const fontsLoaded = useCustomFonts();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollX, setScrollX] = useState(0);

  const { draft, clearDraft, applyTo } = useRoomDraftContext();
  const { roomDetail } = useRoom(roomId, 2, "private");
  const [effectiveRoom, setEffectiveRoom] = useState<RoomDetail | null>(null);
  // clearDraft();
  console.log("Draft: ", draft);

  // Room dimensions - 3x wider than screen
  const roomWidth = screenWidth * 3;
  const roomHeight = screenHeight;

  const openStore = () => {
    router.push("/store");
  };

  useEffect(() => {
    if (roomDetail) {
      setEffectiveRoom(applyTo(roomDetail));
    }
  }, [roomDetail, applyTo]);

  const {
    modalType,
    selectedMemory,
    placedItems,
    placedItemMemories,
    closeModal,
    handleItemSelect,
    moveItem,
    updateRotation,
    bringToFront,
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
    activeSlotId,
    resolveMemory,
  } = useMemory(roomId, scrollX, effectiveRoom?.items ?? []);

  if (!roomDetail) return null;

  console.log("room detail: ", effectiveRoom);

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
              bringToFront={bringToFront}
              onRotate={updateRotation}
              onPress={(frameId, slotId) => handleFramePress(frameId, slotId)}
              onDelete={removeItem}
              trashLayout={trashLayout}
              setTrashActive={setIsTrashActive}
              setShowTrash={setShowTrash}
              memoryResolver={resolveMemory}
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
              router.replace("/hall");
            }}
          >
            <FontAwesome6 name="door-open" size={28} color="white" />
            <Text style={styles.textIcon}>Sảnh</Text>
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
          frameId={activeFrameId}
          slotId={activeSlotId}
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
          frameId={activeFrameId}
          slotId={activeSlotId}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    overflow: "hidden",
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
    marginTop: -2,
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
