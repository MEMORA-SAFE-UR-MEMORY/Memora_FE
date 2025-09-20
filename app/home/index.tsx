import BlurBox from "@src/components/BlurBox";
import SettingModal from "@src/components/SettingModal";
import { useFloatPulse } from "@src/hooks/useFloatPulseOptions";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [settingVisible, setSettingVisible] = useState(false);
  const { animatedStyle } = useFloatPulse({
    amplitude: 10,
    duration: 1600,
    scaleTo: 1.07,
  });

  const TRI_OUTER = 10;
  const TRI_INNER = 8;
  const TRI_OUTER_RIGHT = 14;
  const TRI_INNER_RIGHT = 12;
  const TRI_GAP = 2;

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 26,
          paddingTop: 28,
        }}
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
                paddingVertical: 8,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Baloo2_semiBold",
                  fontSize: 14,
                }}
              >
                Premium
              </Text>
            </LinearGradient>
          </TouchableOpacity>

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
      </View>
      {/* Into house */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: "50%",
            top: "54%",
            zIndex: 20,
          },
          animatedStyle,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/hall")}
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
            position: "relative",
          }}
        >
          {/* Tam giác viền bám chặt mép nút */}
          <View
            style={{
              position: "absolute",
              left: "-29%",
              marginRight: -2, // = -borderWidth để liền mạch
              top: "50%",
              transform: [{ translateY: -TRI_OUTER }],
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
                borderTopWidth: TRI_OUTER,
                borderBottomWidth: TRI_OUTER,
                borderRightWidth: TRI_OUTER_RIGHT,
                borderTopColor: "transparent",
                borderBottomColor: "transparent",
                borderRightColor: "#663530",
              }}
            />
            <View
              style={{
                position: "absolute",
                left: TRI_GAP,
                top: TRI_GAP,
                width: 0,
                height: 0,
                borderTopWidth: TRI_INNER,
                borderBottomWidth: TRI_INNER,
                borderRightWidth: TRI_INNER_RIGHT,
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
                backgroundColor: "#ffffff",
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
              // textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
              elevation: 1,
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
                backgroundColor: "#663530",
                borderColor: "#ffffff",
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
              // textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
              elevation: 1,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 1,
            }}
          >
            Cài đặt
          </Text>
        </View>
      </View>
      {settingVisible && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <SettingModal
            visible={settingVisible}
            onClose={() => setSettingVisible(false)}
          />
        </View>
      )}
    </View>
  );
}
