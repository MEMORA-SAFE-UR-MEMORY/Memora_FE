import BlurBox from "@src/components/BlurBox";
import RoomScreenModal from "@src/components/RoomScreenModal";
import SettingModal from "@src/components/SettingModal";
import { useFloatPulse } from "@src/hooks/useFloatPulseOptions";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HallScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const { animatedStyle } = useFloatPulse({
    amplitude: 10,
    duration: 1600,
    scaleTo: 1.07,
  });

  const safeTop = insets.top + 150;
  const safeLeft = insets.left > 0 ? insets.left + 8 : 24;
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
          paddingTop: Math.max(22, insets.top),
        }}
      >
        <TouchableOpacity>
          <BlurBox
            h={50}
            w={170}
            title="PLAYER INGAME"
            image={require("../../assets/images/AvatarImage.png")}
            imageSize={40}
            textSize={14}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              borderRadius: 20,
              marginRight: 8,
              overflow: "hidden",
            }}
          >
            <LinearGradient
              colors={["#FF7C96", "#FF4268", "#FF5D02"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Premium</Text>
            </LinearGradient>
          </TouchableOpacity>

          <BlurBox h={30} w={98} title="362665" textSize={14} />
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
              width: 54,
              height: 54,
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
                left: "-26%",
                marginRight: 3,
                top: "50%",
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
          top: 75,
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
                backgroundColor: "#FDD700",
                borderColor: "#E2B511",
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
              color: "white",
              fontSize: 12,
              fontWeight: "bold",
              textAlign: "center",
              textShadowColor: "#E2B511",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
              elevation: 1,
              shadowColor: "#2953A7",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
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
                backgroundColor: "#57AFE5",
                borderColor: "#2953A7",
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
              color: "white",
              fontSize: 12,
              fontWeight: "bold",
              textAlign: "center",
              textShadowColor: "#2953A7",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
              elevation: 1,
              shadowColor: "#2953A7",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
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
