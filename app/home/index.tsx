import BlurBox from "@src/components/BlurBox";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 26,
          paddingTop: 22,
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
      </View>
      {/* Bubble text */}
      <View
        style={{
          position: "absolute",
          left: 450,
          top: 200,
          zIndex: 10,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/hall")}
        >
          <View
            style={{
              backgroundColor: "#fae4eaff",
              borderRadius: 24,
              paddingVertical: 10,
              paddingHorizontal: 22,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Text style={{ color: "#333", fontWeight: "500", fontSize: 14 }}>
              Hãy lưu trữ kí ức ở đây
            </Text>
          </View>
        </TouchableOpacity>
        {/* Tam giác nhỏ dưới bubble */}
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: 12,
            borderRightWidth: 12,
            borderTopWidth: 14,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderTopColor: "#fae4eaff",
            marginTop: -2,
            marginRight: 140,
          }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          gap: 12,
          right: 26,
          top: 70,
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
    </View>
  );
}
