import { Stack } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HallLayout() {
  const WALL = require("../../assets/images/inHomeScreen/wall.png");
  const FLOOR = require("../../assets/images/inHomeScreen/floor.png");
  const FLOOR_HEIGHT = 290;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <Image
            source={WALL}
            resizeMode="cover"
            style={StyleSheet.absoluteFillObject}
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
