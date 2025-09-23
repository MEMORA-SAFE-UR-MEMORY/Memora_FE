import BlurBox from "@src/components/BlurBox";
import PremiumButton from "@src/components/PremiumButton";
import SettingModal from "@src/components/SettingModal";
import { useFloatPulse } from "@src/hooks/transitions/useFloatPulseOptions";
import { useShake } from "@src/hooks/transitions/useShakeOptions";
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

export default function HomeScreen() {
  const [settingVisible, setSettingVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const headerPaddingTop = isLandscape
    ? Math.min(Math.max(12, insets.top), 32)
    : Math.min(Math.max(22, insets.top < 34 ? 34 : insets.top), 60);

  const { animatedStyle } = useFloatPulse({
    amplitude: 10,
    duration: 1600,
    scaleTo: 1.07,
  });
  const { animatedStyle: albumShake } = useShake({
    angle: 8,
    translate: 3,
    duration: 140,
  });

  const TRI_OUTER = 10;
  const TRI_INNER = 8;
  const TRI_OUTER_RIGHT = 14;
  const TRI_INNER_RIGHT = 12;
  const TRI_GAP = 2;
  const BORDER_WIDTH = 2;

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
      </View>
      {/* Into house */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: "50%",
            top: "55%",
            zIndex: 20,
          },
          animatedStyle,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.replace("/hall")}
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
              marginRight: -BORDER_WIDTH,
              top: "29%",
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
          marginTop: headerHeight + 4,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={{
              borderRadius: 50,
              marginBottom: -5,
              elevation: 4,
            }}
            // onPress={() => router.replace("/album")}
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
        {/* =============================== */}
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
