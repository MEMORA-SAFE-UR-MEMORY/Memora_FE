import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AddMemoryModal from "@src/components/AddMemoryModal";
import Inventory from "@src/components/Inventory";
import LoadingOverlay from "@src/components/LoadingOverlay";
import MemoryModal from "@src/components/MemoryModal";
import ModalConfirm from "@src/components/ModalConfirm";
import PlacedFrame from "@src/components/PlacedFrame";
import RoomMenu from "@src/components/RoomMenu";
import RoomSetting from "@src/components/RoomSetting";
import { useAuthContext } from "@src/context/AuthContext";
import { useRoomDraftContext } from "@src/context/DraftContext";
import { useRoomContext } from "@src/context/RoomContext";
import useCustomFonts from "@src/hooks/useCustomFonts";
import { useMemory } from "@src/hooks/useMemory";
import { useRoom } from "@src/hooks/useRoom";
import {
  getNextRoomToDiscover,
  resetDiscoveredRooms,
} from "@src/services/roomService";
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
  const { user } = useAuthContext();
  const { roomId, themeId, type, mode, back, setRoomContext } =
    useRoomContext();
  const fontsLoaded = useCustomFonts();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  // Room dimensions - 3x wider than screen
  const roomWidth = screenWidth * 3;
  const roomHeight = screenHeight;
  const scrollX = useSharedValue(0);
  const delayedScrollX = useSharedValue(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  const [isNullRoom, setIsNullRoom] = useState<boolean>(false);

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
      transform: [{ translateX: -delayedScrollX.value * 0.00000001 }],
    };
  });

  const { draft, applyTo } = useRoomDraftContext();

  const [effectiveRoom, setEffectiveRoom] = useState<RoomDetail | null>(null);
  const {
    roomDetail,
    exitToHall,
    isSettingOpen,
    openSetting,
    closeSetting,
    handleSaveSetting,
    loading,
    fetchAndSetRoom,
  } = useRoom(roomId, themeId, type, effectiveRoom, draft, back);

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
    decorCount,
    frameCount,
    MAX_DECOR,
    MAX_FRAME,
    isNotiOpen,
    closeNoti,
    disabledCategories,
    NotiInven,
    setNotiInven,
    isInventoryDisabled,
    activeEditingFrameId,
    exitEditMode,
    enterEditMode,
    onUserInteractionEnd,
    onUserInteractionStart,
    activeFrameItem,
  } = useMemory(roomId, scrollX, effectiveRoom, mode, type, fetchAndSetRoom);

  // Khi memory và items đã render xong
  useEffect(() => {
    if (roomDetail && effectiveRoom && fontsLoaded) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 2000); // delay nhỏ để đảm bảo UI ổn định
      return () => clearTimeout(timeout);
    }
  }, [roomDetail, effectiveRoom, fontsLoaded]);

  const onNext = async () => {
    try {
      if (!user?.id) return;
      setIsLoading(true);

      const nextRoom = await getNextRoomToDiscover(user.id, roomId);
      if (!nextRoom) {
        setIsNullRoom(true);
        return;
      }

      const newRoomId = nextRoom.id;
      const newThemeId = nextRoom.themeId;
      const newType = nextRoom.type ?? "public";
      const newBack = back === "/hall" ? "/hall" : "/home";

      setRoomContext({
        roomId: newRoomId,
        themeId: newThemeId,
        type: newType,
        mode: "view",
        back: newBack,
      });

      router.replace({
        pathname: "/room",
        params: {
          roomId: newRoomId,
          themeId: newThemeId,
          type: newType,
          mode: "view",
          back: newBack,
        },
      });
    } catch (error) {
      console.error("Error fetching next room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmDiscovery = async () => {
    try {
      setIsNullRoom(false);
      if (!user?.id) return;
      setIsLoading(true);

      await resetDiscoveredRooms();
      const nextRoom = await getNextRoomToDiscover(user.id);
      if (!nextRoom) {
        setIsNullRoom(true);
        return;
      }

      const newRoomId = nextRoom.id;
      const newThemeId = nextRoom.themeId;
      const newType = nextRoom.type ?? "public";
      const newBack = back === "/hall" ? "/hall" : "/home";

      setRoomContext({
        roomId: newRoomId,
        themeId: newThemeId,
        type: newType,
        mode: "view",
        back: newBack,
      });

      router.replace({
        pathname: "/room",
        params: {
          roomId: newRoomId,
          themeId: newThemeId,
          type: newType,
          mode: "view",
          back: newBack,
        },
      });
    } catch (error) {
      console.error("Error fetching next room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancelDiscovery = () => {
    setIsNullRoom(false);
    if (back) {
      router.replace(back as any);
    } else {
      router.replace("/hall");
    }
  };

  if (!roomDetail) return null;
  if (isLoading || loading) return <LoadingOverlay />;

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
            {
              width: roomWidth,
              height: roomHeight,
              transitionDelay: "300ms",
            },
            slowedStyle,
          ]}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              if (activeEditingFrameId !== null) exitEditMode();
            }}
          >
            {/* Render placed frames */}
            {placedItems.map((item) => (
              <PlacedFrame
                key={item.id}
                item={item}
                onMove={moveItem}
                bringToFront={bringToFront}
                onRotate={updateRotation}
                onPress={(frameId, slotId, frame) =>
                  handleFramePress(frameId, slotId, frame)
                }
                onDelete={removeItem}
                trashLayout={trashLayout}
                setTrashActive={setIsTrashActive}
                setShowTrash={setShowTrash}
                memoryResolver={resolveMemory}
                roomWidth={roomWidth}
                roomHeight={roomHeight}
                scrollX={scrollX}
                mode={mode ?? "edit"}
                isEditing={activeEditingFrameId === item.id}
                enterEditMode={() => enterEditMode(item.id)}
                onUserInteractionStart={onUserInteractionStart}
                onUserInteractionEnd={onUserInteractionEnd}
              />
            ))}
          </Pressable>
        </Animated.View>
      </Animated.ScrollView>

      {/* Fixed UI Elements */}
      <View style={styles.fixedUIContainer}>
        {/* Bottom UI */}
        <View style={styles.bottomContainer}>
          {/* Home */}
          <Pressable style={styles.icon} onPress={() => exitToHall(hasChanges)}>
            <FontAwesome6 name="door-open" size={28} color="white" />
            <Text style={styles.textIcon}>
              {back === "/hall" ? "Sảnh" : "Home"}
            </Text>
          </Pressable>

          <RoomMenu
            mode={mode}
            onOpenInventory={openInventory}
            onOpenSetting={openSetting}
            isInventoryDisabled={isInventoryDisabled}
            onNext={onNext}
          />
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
              const { width, height } = e.nativeEvent.layout;
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
          disabledCategories={disabledCategories}
          onCategoryDisabledPress={(categoryId) => {
            setNotiInven({
              show: true,
              categoryId,
            });
          }}
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
          frameItem={activeFrameItem}
          slotId={activeSlotId}
        />
      )}

      {modalType === "view" && selectedMemory && (
        <MemoryModal
          visible={true}
          onClose={closeModal}
          memory={selectedMemory}
          onUpdate={handleUpdateMemory}
          onSave={handleSaveMemory}
          onDelete={handleDeleteMemory}
          onFrameRemoved={activeFrameId === null}
          frameItem={activeFrameItem}
          slotId={activeSlotId}
          mode={mode ?? "edit"}
          memoryResolver={resolveMemory}
        />
      )}

      {isNotiOpen && (
        <ModalConfirm
          visible={true}
          mode="noti"
          onClose={closeNoti}
          onConfirm={closeNoti}
          titleText="Thông báo"
          contentText={
            decorCount === MAX_DECOR && frameCount === MAX_FRAME
              ? "Bạn đã đạt giới hạn 25 item trong phòng."
              : decorCount === MAX_DECOR
                ? "Bạn đã đạt giới hạn 10 item trang trí."
                : frameCount === MAX_FRAME
                  ? "Bạn đã đạt giới hạn 15 item khung."
                  : ""
          }
          icon={<FontAwesome5 name="exclamation" size={30} color="white" />}
          iconBgColor="#F75270"
          confirmBtnText="Đóng"
          confirmBtnColor="grey"
          width={340}
        />
      )}

      {NotiInven.show && (
        <ModalConfirm
          visible={true}
          mode="noti"
          onClose={() => setNotiInven({ show: false, categoryId: null })}
          onConfirm={() => setNotiInven({ show: false, categoryId: null })}
          titleText="Thông báo"
          contentText={
            NotiInven.categoryId
              ? NotiInven.categoryId === 2
                ? "Bạn không thể thêm item trang trí."
                : "Bạn không thể thêm item khung."
              : "Bạn không thể mở tủ đồ."
          }
          icon={<FontAwesome5 name="exclamation" size={30} color="white" />}
          iconBgColor="#F75270"
          confirmBtnText="Đóng"
          confirmBtnColor="grey"
          width={340}
        />
      )}

      {isNullRoom && (
        <ModalConfirm
          visible={true}
          mode="confirm"
          titleText="Hết phòng để khám phá"
          contentText="Bạn đã khám phá hết các phòng hiện có. Bạn muốn quay về để trang trí phòng của mình, hay tiếp tục khám phá lại?"
          icon={<FontAwesome5 name="exclamation" size={30} color="white" />}
          iconBgColor="#FBBF24"
          confirmBtnText="Khám phá lại"
          confirmBtnColor="green"
          cancelBtnText="Quay về"
          cancelBtnColor="grey"
          onClose={() => setIsNullRoom(false)}
          onConfirm={onConfirmDiscovery}
          onCancel={onCancelDiscovery}
          width={460}
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
