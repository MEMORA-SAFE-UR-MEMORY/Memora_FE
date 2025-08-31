import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function Home() {
  return (
    <ImageBackground
      source={require("../assets/images/homebgmemora.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            paddingHorizontal: 16,
          }}
        >
          <BlurView
            intensity={100}
            tint="light"
            style={{
              height: 50,
              width: 166,
              padding: 4,
              borderRadius: 161,
              overflow: "hidden",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
              justifyContent: "space-between",
              borderColor: "white",
              borderWidth: 1,
              gap: 5,
            }}
          >
            <View
              style={{
                borderWidth: 1,
                borderRadius: 100,
                width: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFADAD",
              }}
            >
              <Ionicons name="person" size={20} />
            </View>
            <Text
              style={{
                fontWeight: "semibold",
                fontSize: 14,
              }}
            >
              PLAYER INGAME
            </Text>
          </BlurView>

          <View
            style={{
              height: 50,
              width: 166,
              zIndex: 10,
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
              justifyContent: "space-between",
              gap: 13,
              marginRight: 20,
            }}
          >
            <View>
              <FontAwesome
                name="diamond"
                size={20}
                color="purple"
                style={{
                  position: "absolute",
                  left: -10,
                  zIndex: 10,
                  transform: [{ rotate: "-20deg" }],
                  top: 3,
                }}
              />

              <BlurView
                intensity={100}
                tint="light"
                style={{
                  height: 28,
                  width: 98,

                  borderRadius: 161,
                  overflow: "hidden",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  justifyContent: "center",
                  borderColor: "white",
                  borderWidth: 0.8,
                }}
              >
                <Text style={{ fontWeight: "semibold", fontSize: "18" }}>
                  4663
                </Text>
              </BlurView>
            </View>
            <View>
              <FontAwesome5
                name="cookie-bite"
                size={20}
                color="pink"
                style={{
                  position: "absolute",
                  left: -10,
                  zIndex: 10,
                  transform: [{ rotate: "-20deg" }],
                  top: 3,
                }}
              />
              <BlurView
                intensity={100}
                tint="light"
                style={{
                  height: 28,
                  width: 98,
                  borderRadius: 161,
                  overflow: "hidden",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  justifyContent: "center",
                  borderColor: "white",
                  borderWidth: 0.8,
                  gap: 5,
                }}
              >
                <Text style={{ fontWeight: "semibold", fontSize: "18" }}>
                  362665
                </Text>
              </BlurView>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 24, marginBottom: 20 },
});
