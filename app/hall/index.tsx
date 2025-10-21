import AsyncStorage from "@react-native-async-storage/async-storage";
import BlurBox from "@src/components/BlurBox";
import ConfirmDeleteAccountModal from "@src/components/ConfirmDeleteAccountModal";
import DailyRewardModal from "@src/components/dailyReward/DailyRewardModal";
import ExploreIntroModal from "@src/components/ExploreIntroModal";
import GoldShineButton from "@src/components/GoldShineButton";
import ConfirmDeleteModal from "@src/components/inHome/ConfirmDeleteModal";
import DoorsScroller from "@src/components/inHome/DoorsScroller";
import IntoHouseButton from "@src/components/inHome/intoHouseButton";
import RoomScreenModal from "@src/components/RoomScreenModal";
import SettingModal from "@src/components/SettingModal";

import { useShake } from "@src/hooks/transitions/useShakeOptions";
import { useLogin } from "@src/hooks/useLogin";

import { router } from "expo-router";
import { Menu } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchRandomPublicRoom } from "services/rooms/api";
import { useRooms } from "services/rooms/hook";
import { useDeleteAccount } from "services/users/hook";
import { useDailyReward, useWalletGet } from "services/wallet/hook";

type User = {
  username: string;
};

export default function HallScreen() {
  const [userData, setUserData] = useState<User | null>(null);
  const { rooms, loading: roomsLoading, addRoom, removeRoom } = useRooms();
  const { wallet, loading: walletLoading } = useWalletGet();
  const {
    canClaim,
    timeLeft,
    claim,
    claiming,
    loading: dailyLoading,
  } = useDailyReward();
  const [dailyVisible, setDailyVisible] = useState(false);
  const [holdDailyModal, setHoldDailyModal] = useState(false);

  const goHome = useCallback(() => router.replace("/home"), []);

  const [modalVisible, setModalVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const { deleteAccount, loading } = useDeleteAccount();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [exploreIntroVisible, setExploreIntroVisible] = useState(false);
  const lastExploredRoomRef = useRef<number | null>(null);

  // Delete modal state
  const [deleteRoomVisible, setDeleteRoomVisible] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState(false);
  const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedRoomName, setSelectedRoomName] = useState<string>("");

  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const formatNumber = (n: number) => n.toLocaleString("vi-VN");

  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const userStr = await AsyncStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData(user);
        }
      } catch {}
    };
    getUserFromStorage();
  }, []);

  useEffect(() => {
    if (!dailyLoading && !holdDailyModal) {
      setDailyVisible(canClaim);
    }
  }, [canClaim, dailyLoading, holdDailyModal]);

  useEffect(() => {
    (async () => {
      try {
        const last = await AsyncStorage.getItem("explore.lastRoomId");
        if (last) lastExploredRoomRef.current = Number(last) || null;
      } catch {}
    })();
  }, []);

  const handleClaimDaily = async () => {
    await claim(100);
  };

  const { animatedStyle: albumShake } = useShake({
    angle: 6,
    translate: 2,
    duration: 140,
  });

  const headerPaddingTop = isLandscape
    ? Math.min(Math.max(12, insets.top), 32)
    : Math.min(Math.max(22, insets.top < 34 ? 34 : insets.top), 60);

  const safeLeft = (insets.left > 0 ? insets.left : 16) + (isLandscape ? 4 : 8);

  const handleConfirm = async (
    roomName: string,
    themeId: number | null,
    doorId: number | null
  ) => {
    try {
      if (themeId == null) {
        return;
      }
      setModalVisible(false);
      await addRoom(roomName, themeId, doorId);
    } catch {}
  };

  const openDeleteModal = (roomId: number, roomName: string) => {
    setSelectedRoomId(roomId);
    setSelectedRoomName(roomName);
    setDeleteRoomVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedRoomId) return;
    try {
      setDeletingRoom(true);
      await removeRoom(selectedRoomId);
      setDeleteRoomVisible(false);
      setSelectedRoomId(null);
      setSelectedRoomName("");
    } catch {
    } finally {
      setDeletingRoom(false);
    }
  };
  const { handleLogout } = useLogin();

  const handleConfirmDelete = async () => {
    try {
      await deleteAccount();
      setDeleteAccountVisible(false);
      setUserData(null);

      await new Promise((r) => setTimeout(r, 100));
      await handleLogout();
    } catch {}
  };

  const outHomePos = useMemo(() => {
    if (isLandscape) {
      const topPx = Math.max(headerPaddingTop + 12, height * 0.5 - 28);
      return {
        left: safeLeft,
        top: topPx,
        zIndex: 9999,
        elevation: 50,
      } as const;
    }
    return {
      left: width * 0.5,
      top: height * 0.55,
      zIndex: 9999,
      elevation: 50,
    } as const;
  }, [isLandscape, safeLeft, headerPaddingTop, height, width]);

  const openRoom = useCallback(
    (room: { id: number; theme_id?: number | null; type?: string }) => {
      if (room.theme_id == null) {
        return;
      }
      const params = {
        roomId: String(room.id),
        themeId: String(room.theme_id),
        type: room.type ?? "private",
        back: "/hall",
      };

      router.replace({ pathname: "/room", params });
    },
    []
  );

  // Discovery
  const handleExploreRandom = useCallback(async () => {
    try {
      let excludeUserId: string | null = null;
      try {
        const userStr = await AsyncStorage.getItem("user");
        if (userStr) {
          const u = JSON.parse(userStr);
          excludeUserId = u?.id ?? u?.user_id ?? null;
        }
        if (!excludeUserId) {
          excludeUserId = (await AsyncStorage.getItem("userId")) ?? null;
        }
      } catch {}

      const r = await fetchRandomPublicRoom(
        excludeUserId ?? undefined,
        lastExploredRoomRef.current
      );
      if (!r) {
        return;
      }
      const params = {
        roomId: String(r.roomId),
        themeId: String(r.themeId),
        type: r.type ?? "public",
        mode: "view" as const,
        back: "/hall",
      };
      router.replace({ pathname: "/room", params });
      lastExploredRoomRef.current = r.roomId;
      try {
        await AsyncStorage.setItem("explore.lastRoomId", String(r.roomId));
      } catch {}
    } catch {}
  }, []);

  const handleExplorePress = useCallback(() => {
    setExploreIntroVisible(true); // luôn mở modal
  }, []);

  const onConfirmExploreIntro = useCallback(() => {
    setExploreIntroVisible(false);
    handleExploreRandom();
  }, [handleExploreRandom]);

  return (
    <View style={{ flex: 1 }}>
      {/* ============ DANH SÁCH CỬA ============ */}
      <DoorsScroller
        rooms={rooms}
        roomsLoading={roomsLoading}
        onDoorPress={openRoom}
        onDoorLongPress={(room) => openDeleteModal(room.id, room.room_name)}
        onAddDoorPress={() => setModalVisible(true)}
      />

      {/* ============ HEADER + NÚT ============ */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        {/* ========== HEADER ========== */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 40,
            paddingTop: headerPaddingTop,
          }}
          onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        >
          <TouchableOpacity>
            <BlurBox
              h={50}
              title={userData?.username ?? "Guest"}
              image={require("../../assets/images/AvatarImage.png")}
              imageSize={40}
              textSize={16}
              fontFamily="Baloo2_semiBold"
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* <PremiumButton onPress={() => console.log("Go to premium")} /> */}
            <View
              style={{
                height: 34,
                width: 98,
                backgroundColor: "#FFFFFF",
                borderColor: "#663530",
                borderWidth: 2,
                borderRadius: 40,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 12,
                shadowColor: "#663530",
                shadowOpacity: 0.25,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 3,
                marginLeft: 16,
                position: "relative",
              }}
            >
              <Image
                source={require("../../assets/icons/money.png")}
                style={{
                  width: 50,
                  height: 50,
                  position: "absolute",
                  left: -30,
                  top: -10,
                  transform: [{ rotate: "-30deg" }],
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 16,
                  color: "#663530",
                  fontFamily: "Baloo2_bold",
                }}
              >
                {walletLoading ? "…" : formatNumber(wallet?.puzzles ?? 0)}
              </Text>
            </View>

            {/* Hamburger to open settings modal */}
            <TouchableOpacity
              style={{ marginLeft: 12, borderRadius: 50, elevation: 3 }}
              onPress={() => setSettingVisible(true)}
            >
              <View
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#663530",
                  borderWidth: 2,
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Menu size={20} color="#663530" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nút cửa hàng*/}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            right: 26,
            marginTop: headerHeight + 4,
            position: "absolute",
            alignSelf: "flex-end",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={{
                borderRadius: 50,
                marginBottom: -5,
                elevation: 4,
              }}
              onPress={() => router.replace("/album")}
            >
              <View
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#663530",
                  borderWidth: 2,
                  width: 41,
                  height: 41,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Animated.View style={albumShake}>
                  <Image
                    source={require("../../assets/icons/Album.png")}
                    style={{
                      width: 42,
                      height: 42,
                      marginTop: -4,
                    }}
                    resizeMode="contain"
                  />
                </Animated.View>
              </View>
            </TouchableOpacity>
            <Text
              style={{
                color: "#663530",
                fontSize: 15,
                fontFamily: "Baloo2_bold",
                textAlign: "center",
                textShadowColor: "#d0948dff",
                textShadowRadius: 1,
                elevation: 1,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 1,
              }}
            >
              Album
            </Text>
          </View>
          {/* ====== QUÀ NGÀY ====== */}
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={{
                borderRadius: 50,
                marginBottom: -5,
                elevation: 4,
                opacity: dailyLoading ? 0.6 : 1,
              }}
              onPress={() => setDailyVisible(true)}
              disabled={dailyLoading}
            >
              <View
                style={{
                  backgroundColor: canClaim ? "#E9D8FF" : "#f2f2f2",
                  borderColor: "#663530",
                  borderWidth: 2,
                  width: 41,
                  height: 41,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Animated.View style={albumShake}>
                  <Image
                    source={require("../../assets/icons/gift.png")}
                    style={{ width: 34, height: 34, marginTop: -4 }}
                    resizeMode="contain"
                  />
                </Animated.View>

                {canClaim && (
                  <View
                    style={{
                      position: "absolute",
                      right: -16,
                      top: -6,
                      minWidth: 18,
                      height: 18,
                      paddingHorizontal: 4,
                      borderRadius: 9,
                      backgroundColor: "#ef4444",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 2,
                      borderColor: "white",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 10,
                        fontWeight: "700",
                      }}
                    >
                      +100
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <Text
              style={{
                color: "#663530",
                fontSize: 14,
                fontFamily: "Baloo2_bold",
                textAlign: "center",
                textShadowColor: "#d0948dff",
                textShadowRadius: 1,
                elevation: 1,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 1,
              }}
            >
              Quà ngày
            </Text>
            {!canClaim && !dailyLoading && (
              <Text
                style={{
                  color: "#8b8b8b",
                  fontSize: 12,
                  fontFamily: "Baloo2_medium",
                  marginTop: -2,
                }}
              >
                {timeLeft}
              </Text>
            )}
          </View>

          {/* CỬA HÀNG */}
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={{
                borderRadius: 50,
                overflow: "hidden",
                marginBottom: -5,
                elevation: 4,
              }}
              onPress={() => router.push("/store")}
            >
              <View
                style={{
                  backgroundColor: "#ffffffff",
                  borderColor: "#663530",
                  borderWidth: 2,
                  padding: 6,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/icons/Gameshopred.png")}
                  style={{ width: 26, height: 26 }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
            <Text
              style={{
                color: "#663530",
                fontSize: 14,
                fontFamily: "Baloo2_bold",
                textAlign: "center",
              }}
            >
              Cửa hàng
            </Text>
          </View>
          {/* Khám phá (gold shine) */}
          <GoldShineButton
            label="Khám phá"
            iconSource={require("../../assets/icons/discovery.png")}
            onPress={handleExplorePress}
          />
        </View>
      </View>

      <IntoHouseButton onPress={goHome} containerStyle={outHomePos} />

      {/* ========== MODALS ========== */}
      <RoomScreenModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />
      <SettingModal
        visible={settingVisible}
        onClose={() => setSettingVisible(false)}
        onOpenDeleteAccount={() => setDeleteAccountVisible(true)}
      />
      <ConfirmDeleteModal
        visible={deleteRoomVisible}
        roomName={selectedRoomName}
        onCancel={() => setDeleteRoomVisible(false)}
        onConfirm={confirmDelete}
        loading={deletingRoom}
      />
      <ConfirmDeleteAccountModal
        visible={deleteAccountVisible}
        onCancel={() => setDeleteAccountVisible(false)}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
      <DailyRewardModal
        visible={dailyVisible}
        canClaim={canClaim}
        timeLeft={timeLeft}
        onClose={() => setDailyVisible(false)}
        onClaim={handleClaimDaily}
        claiming={claiming}
        onCelebration={setHoldDailyModal}
      />
      <ExploreIntroModal
        visible={exploreIntroVisible}
        onClose={() => setExploreIntroVisible(false)}
        onConfirm={onConfirmExploreIntro}
      />
    </View>
  );
}
