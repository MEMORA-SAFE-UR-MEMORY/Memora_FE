import BlurBox from "@src/components/BlurBox";
import AddDoorButton from "@src/components/inHome/AddDoorButton";
import DoorItem from "@src/components/inHome/DoorItem";
import PremiumButton from "@src/components/PremiumButton";
import RoomScreenModal from "@src/components/RoomScreenModal";
import SettingModal from "@src/components/SettingModal";
import { Door, useDoors } from "@src/hooks/inHome/useDoors";
import { useFloatPulse } from "@src/hooks/transitions/useFloatPulseOptions";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HallScreen() {
  const { doors, addDoor } = useDoors([
    {
      id: "default",
      color: "#ffffff",
      image: require("../../assets/images/doors/default.png"),
      name: "Phòng mặc định",
      theme: "default",
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

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

  const handleConfirm = (roomName: string, theme: string, color: string) => {
    const imageMap: Record<string, any> = {
      "#FBC393": require("../../assets/images/doors/cửa cam.png"),
      "#F9B8AE": require("../../assets/images/doors/cửa đỏ.png"),
      "#F7BECD": require("../../assets/images/doors/cửa hồng.png"),
      "#876F57": require("../../assets/images/doors/default.png"),
      "#EAD6B7": require("../../assets/images/doors/cửa nâu sáng.png"),
      "#dec8e0": require("../../assets/images/doors/cửa tím.png"),
      "#F6E6AC": require("../../assets/images/doors/cửa vàng.png"),
      "#BAE2FB": require("../../assets/images/doors/cửa xanh dương.png"),
      "#8AB7C7": require("../../assets/images/doors/cửa xanh trầm.png"),
      "#DDE5A9": require("../../assets/images/doors/cửa xanh lá.png"),
    };

    const newDoor: Door = {
      id: Date.now().toString(),
      name: roomName,
      theme,
      color,
      image:
        imageMap[color] || require("../../assets/images/doors/default.png"),
    };

    addDoor(newDoor);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* ============ DANH SÁCH CỬA ============ */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 24,
          padding: 26,
          alignItems: "flex-end",
        }}
        style={{ zIndex: 1 }}
      >
        {doors.map((door) => (
          <DoorItem
            key={door.id}
            door={door}
            onPress={() => console.log("Go to room", door.id)}
          />
        ))}

        <AddDoorButton onPress={() => setModalVisible(true)} />
      </ScrollView>

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
              w={180}
              title="PLAYER INGAME"
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
              }}
            >
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
          {/* ========== CỬA HÀNG ========== */}
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

          {/* ========== CÀI ĐẶT ========== */}
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
      />
    </View>
  );
}
