import { Stack } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HallLayout() {
  const [loading, setLoading] = useState(true);

  const WALL = require("../../assets/images/inHomeScreen/wall.png");
  const FLOOR = require("../../assets/images/inHomeScreen/floor.png");
  const FLOOR_HEIGHT = 290;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        {loading && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
              backgroundColor: "rgba(255,255,255,0.6)",
            }}
          >
            <ActivityIndicator size="large" color="#D2A4FF" />
          </View>
        )}
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <Image
            source={WALL}
            resizeMode="cover"
            style={StyleSheet.absoluteFillObject}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        </View>

        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: FLOOR_HEIGHT,
            zIndex: 2,
          }}
        >
          <Image
            source={FLOOR}
            resizeMode="stretch"
            style={{
              width: "100%",
              height: FLOOR_HEIGHT,
            }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        </View>

        <View style={{ flex: 1, zIndex: 5 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
          </Stack>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
