import BlurBox from "@src/components/BlurBox";
import PremiumButton from "@src/components/PremiumButton";
import RoomScreenModal from "@src/components/RoomScreenModal";
import SettingModal from "@src/components/SettingModal";
import { useFloatPulse } from "@src/hooks/useFloatPulseOptions";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HallScreen() {
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

  const handleAddRoom = () => {
    setModalVisible(false);
    router.push("/room");
  };

  return (
    <View style={{ flex: 1 }}>
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
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
            onPress={() => router.push("/home")}
            style={{
              backgroundColor: "white",
              width: 48,
              height: 48,
              borderRadius: 27,
              alignItems: "center",
              justifyContent: "center",
              // Bóng iOS
              shadowColor: "#663530",
              shadowOpacity: 0.35,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              // Elevation Android
              elevation: 6,
              borderWidth: 2,
              borderColor: "#663530",
              position: "relative",
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

      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          gap: 12,
          right: 26,
          marginTop: headerHeight + 4,
        }}
      >
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
                borderTopWidth: 2,
                borderBottomWidth: 2,
                borderLeftWidth: 2,
                borderRightWidth: 2,
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
              textShadowColor: "#d0948dff",
              textShadowRadius: 1,
              elevation: 1,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 1,
            }}
          >
            Cửa hàng
          </Text>
        </View>
        {/* =============================== */}
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
                borderTopWidth: 2,
                borderBottomWidth: 2,
                borderLeftWidth: 2,
                borderRightWidth: 2,
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
              textShadowColor: "#d0948dff",

              textShadowRadius: 1,
              elevation: 1,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 1,
            }}
          >
            Cài đặt
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={{
          position: "absolute",
          width: 160,
          height: 260,
          top: 130,
          left: 360,
          borderWidth: 2,
          borderStyle: "dashed",
          borderColor: "#A8A8A8",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 6,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ fontSize: 40, fontWeight: "bold", color: "#555" }}>
          +
        </Text>
      </TouchableOpacity>
      <RoomScreenModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleAddRoom}
      />
      <SettingModal
        visible={settingVisible}
        onClose={() => setSettingVisible(false)}
      />
    </View>
  );
}
