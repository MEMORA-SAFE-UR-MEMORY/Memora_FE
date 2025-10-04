import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AddMemoryModal from "@src/components/AddMemoryModal";
import Inventory from "@src/components/Inventory";
import LoadingOverlay from "@src/components/LoadingOverlay";
import MemoryModal from "@src/components/MemoryModal";
import PlacedFrame from "@src/components/PlacedFrame";
import RoomMenu from "@src/components/RoomMenu";
import RoomSetting from "@src/components/RoomSetting";
import { useRoomDraftContext } from "@src/context/DraftContext";
import { useRoomContext } from "@src/context/RoomContext";
import useCustomFonts from "@src/hooks/useCustomFonts";
import { useMemory } from "@src/hooks/useMemory";
import { useRoom } from "@src/hooks/useRoom";
import { RoomDetail } from "@src/types/room";
import { isDraftChanged } from "@src/utils/draftUtils";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const Room = () => {
  const { roomId, themeId, type, mode, back } = useRoomContext();
  const fontsLoaded = useCustomFonts();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  // Room dimensions - 3x wider than screen
  const roomWidth = screenWidth * 3;
  const roomHeight = screenHeight;
  const scrollX = useSharedValue(0);
  const delayedScrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  useAnimatedReaction(
    () => scrollX.value,
    (value) => {
      delayedScrollX.value = withSpring(value, {
        damping: 30, // lực hãm, càng cao thì càng ít rung
        stiffness: 20, // độ cứng, càng thấp thì càng chậm rãi
        mass: 20, // khối lượng, càng cao thì càng ì, nặng
        overshootClamping: true,
        energyThreshold: 6e-9,
      });
    }
  );

  const slowedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -delayedScrollX.value * 0.000001 }],
    };
  });

  const { draft, clearDraft, applyTo } = useRoomDraftContext();

  const [effectiveRoom, setEffectiveRoom] = useState<RoomDetail | null>(null);
  const {
    roomDetail,
    exitToHall,
    isSettingOpen,
    openSetting,
    closeSetting,
    handleSaveSetting,
  } = useRoom(roomId, themeId, type, effectiveRoom, draft, back);

  // clearDraft();
  // console.log("Draft: ", draft);

  const openStore = () => {
    router.push("/store");
  };

  useEffect(() => {
    if (!roomDetail) return;

    const handler = setTimeout(() => {
      setEffectiveRoom(applyTo(roomDetail));
    }, 200);

    return () => clearTimeout(handler);
  }, [roomDetail, draft, applyTo]);

  const hasChanges = isDraftChanged(effectiveRoom!, draft);

  // console.log("room detail: ", roomDetail);

  const {
    modalType,
    selectedMemory,
    placedItems,
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
  } = useMemory(roomId, scrollX, effectiveRoom?.items ?? [], mode);

  if (!roomDetail) return null;

  // console.log("placed items: ", placedItems);

  return (
    <View style={styles.container}>
      {!fontsLoaded && <LoadingOverlay />}

      {/* Scrollable Room Area */}
      <Animated.ScrollView
        horizontal
        style={styles.roomScrollView}
        contentContainerStyle={[styles.roomContent, { width: roomWidth }]}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        decelerationRate="fast"
      >
        <Animated.View
          style={[
            { width: roomWidth, height: roomHeight, transitionDelay: "300ms" },
            slowedStyle,
          ]}
        >
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
              mode={mode ?? "edit"}
            />
          ))}
        </Animated.View>
      </Animated.ScrollView>

      {/* Fixed UI Elements */}
      <View style={styles.fixedUIContainer}>
        {/* Bottom UI */}
        <View style={styles.bottomContainer}>
          {/* Home */}
          <Pressable style={styles.icon} onPress={() => exitToHall(hasChanges)}>
            <FontAwesome6 name="door-open" size={28} color="white" />
            <Text style={styles.textIcon}>Sảnh</Text>
          </Pressable>

          {mode !== "view" && (
            <>
              {/* Menu */}
              <RoomMenu
                onOpenInventory={openInventory}
                onOpenSetting={openSetting}
              />
            </>
          )}
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

      {isSettingOpen && (
        <RoomSetting
          visible={true}
          onClose={closeSetting}
          onSave={handleSaveSetting}
          currentType={roomDetail.type}
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
          mode={mode ?? "edit"}
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
