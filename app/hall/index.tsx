import AsyncStorage from "@react-native-async-storage/async-storage";
import BlurBox from "@src/components/BlurBox";
import ConfirmDeleteAccountModal from "@src/components/ConfirmDeleteAccountModal";
import ConfirmDeleteModal from "@src/components/inHome/ConfirmDeleteModal";
import DoorsScroller from "@src/components/inHome/DoorsScroller";
import PremiumButton from "@src/components/PremiumButton";
import RoomScreenModal from "@src/components/RoomScreenModal";
import SettingModal from "@src/components/SettingModal";

import { useFloatPulse } from "@src/hooks/transitions/useFloatPulseOptions";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRooms } from "services/rooms/hook";
import { useDeleteAccount } from "services/users/hook";

type User = {
  username: string;
};

export default function HallScreen() {
  const { rooms, loading: roomsLoading, addRoom, removeRoom } = useRooms();
  const [userData, setUserData] = useState<User | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const { deleteAccount, loading } = useDeleteAccount();
  const [headerHeight, setHeaderHeight] = useState(0);

  // Delete modal state
  const [deleteRoomVisible, setDeleteRoomVisible] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState(false);
  const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedRoomName, setSelectedRoomName] = useState<string>("");

  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const userStr = await AsyncStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData(user);
        }
      } catch (error) {
        console.error("Error getting user from storage:", error);
      }
    };
    getUserFromStorage();
  }, []);

  const { animatedStyle } = useFloatPulse({
    amplitude: 10,
    duration: 1600,
    scaleTo: 1.07,
  });

  const headerPaddingTop = isLandscape
    ? Math.min(Math.max(12, insets.top), 32)
    : Math.min(Math.max(22, insets.top < 34 ? 34 : insets.top), 60);

  const safeTop = isLandscape
    ? headerPaddingTop + height * 0.45
    : headerPaddingTop + 150;
  const safeLeft = (insets.left > 0 ? insets.left : 16) + (isLandscape ? 4 : 8);

  const handleConfirm = async (
    roomName: string,
    theme: string,
    doorId: number
  ) => {
    try {
      await addRoom(roomName, theme, doorId);
      setModalVisible(false);
    } catch (e) {
      console.log("Create room failed:", e);
    }
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
    } catch (e) {
      console.log("Delete room failed:", e);
    } finally {
      setDeletingRoom(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAccount();
      setDeleteAccountVisible(false);
      router.replace("/");
    } catch (e) {
      console.log("Delete account failed:", e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* ============ DANH SÁCH CỬA ============ */}
      <DoorsScroller
        rooms={rooms}
        roomsLoading={roomsLoading}
        onDoorPress={() => router.replace("/room")}
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
            paddingHorizontal: 26,
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
            <PremiumButton onPress={() => console.log("Go to premium")} />
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
                  left: -28,
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
                362665
              </Text>
            </View>
          </View>

          <Animated.View
            style={[
              {
                position: "absolute",
                top: safeTop,
                left: safeLeft,
                zIndex: 20,
              },
              animatedStyle,
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.replace("/home")}
              style={{
                backgroundColor: "white",
                width: 48,
                height: 48,
                borderRadius: 27,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#663530",
                shadowOpacity: 0.35,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: 6,
                borderWidth: 2,
                borderColor: "#663530",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  left: "-29%",
                  marginRight: -2,
                  top: "29%",
                  transform: [{ translateY: -10 }],
                  width: 0,
                  height: 0,
                }}
                pointerEvents="none"
              >
                <View
                  style={{
                    position: "absolute",
                    width: 0,
                    height: 0,
                    borderTopWidth: 10,
                    borderBottomWidth: 10,
                    borderRightWidth: 14,
                    borderTopColor: "transparent",
                    borderBottomColor: "transparent",
                    borderRightColor: "#663530",
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    left: 2,
                    top: 2,
                    width: 0,
                    height: 0,
                    borderTopWidth: 8,
                    borderBottomWidth: 8,
                    borderRightWidth: 12,
                    borderTopColor: "transparent",
                    borderBottomColor: "transparent",
                    borderRightColor: "white",
                  }}
                />
              </View>
              <Image
                source={require("../../assets/icons/Door.png")}
                style={{ width: 28, height: 28 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Nút cửa hàng + cài đặt */}
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
                  source={require("../../assets/icons/Game shop red.png")}
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

          {/* CÀI ĐẶT */}
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={{
                borderRadius: 50,
                overflow: "hidden",
                marginBottom: -5,
                elevation: 4,
              }}
              onPress={() => setSettingVisible(true)}
            >
              <View
                style={{
                  backgroundColor: "#663530",
                  borderColor: "#663530",
                  borderWidth: 2,
                  padding: 7,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/icons/setting.png")}
                  style={{ width: 24, height: 24 }}
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
              Cài đặt
            </Text>
          </View>
        </View>
      </View>

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
    </View>
  );
}
