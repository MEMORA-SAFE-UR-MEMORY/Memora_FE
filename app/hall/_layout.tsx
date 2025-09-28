import { ScrollXContext } from "@src/context/ScrollXContext";
import { Stack } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HallLayout() {
  const [loading, setLoading] = useState(true);

  const WALL = require("../../assets/images/inHomeScreen/wall.png");
  const FLOOR = require("../../assets/images/inHomeScreen/floor.png");
  const FLOOR_HEIGHT = 290;

  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(SCREEN_WIDTH);

  const BG_PARALLAX = 0.35;
  const maxScroll = Math.max(0, contentWidth - SCREEN_WIDTH);
  const WALL_WIDTH = SCREEN_WIDTH + BG_PARALLAX * maxScroll;
  const FLOOR_WIDTH = SCREEN_WIDTH + BG_PARALLAX * maxScroll;

  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaProvider>
      <ScrollXContext.Provider value={{ scrollX, setContentWidth }}>
        <View style={styles.container}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#D2A4FF" />
            </View>
          )}

          {/* Wall */}
          <View pointerEvents="none" style={styles.wall}>
            <Animated.Image
              source={WALL}
              resizeMode="cover"
              style={[
                styles.wallImage,
                {
                  width: WALL_WIDTH,
                  transform: [
                    { translateX: Animated.multiply(scrollX, -BG_PARALLAX) },
                  ],
                },
              ]}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
          </View>

          {/* Floor */}
          <View
            pointerEvents="none"
            style={[styles.floorContainer, { height: FLOOR_HEIGHT }]}
          >
            <Animated.Image
              source={FLOOR}
              resizeMode="stretch"
              style={{
                width: FLOOR_WIDTH,
                height: FLOOR_HEIGHT,
                transform: [
                  { translateX: Animated.multiply(scrollX, -BG_PARALLAX) },
                ],
              }}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
              }}
            >
              <Stack.Screen
                name="index"
                options={{ headerShown: false, gestureEnabled: false }}
              />
            </Stack>
          </View>
        </View>
      </ScrollXContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  wall: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
  },
  wallImage: {
    width: "100%",
    height: "100%",
  },
  floorContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 2,
    overflow: "hidden",
  },
  content: { flex: 1, zIndex: 5 },
});
