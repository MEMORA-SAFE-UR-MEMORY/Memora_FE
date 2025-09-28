import BlockingOverlay from "@src/components/inHome/BlockingOverlay";
import HallBackground from "@src/components/inHome/HallBackground";
import { ScrollXContext } from "@src/context/ScrollXContext";

import { Stack } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HallLayout() {
  const [loading, setLoading] = useState(true);
  const [uiReady, setUiReady] = useState(false);

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
  const blocking = loading || !uiReady;

  return (
    <SafeAreaProvider>
      <ScrollXContext.Provider
        value={{ scrollX, setContentWidth, setHallReady: setUiReady }}
      >
        <View style={styles.container}>
          <BlockingOverlay visible={blocking} />

          <HallBackground
            wallSource={WALL}
            floorSource={FLOOR}
            floorHeight={FLOOR_HEIGHT}
            wallWidth={WALL_WIDTH}
            floorWidth={FLOOR_WIDTH}
            scrollX={scrollX}
            parallax={BG_PARALLAX}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />

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
  content: { flex: 1, zIndex: 5 },
});
