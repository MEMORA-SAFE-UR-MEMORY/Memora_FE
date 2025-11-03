import MyAlbumsHeader from "@src/components/album/MyAlbumsHeader";
import { Stack } from "expo-router";
import React from "react";
import { ImageBackground, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function MyAlbumLayout() {
  const bg = require("../../assets/images/album/album_bg.jpg");
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <ImageBackground source={bg} resizeMode="cover" style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              header: () => <MyAlbumsHeader />,
              contentStyle: { backgroundColor: "transparent" },
              animation: "fade",
              gestureEnabled: false,
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                header: () => (
                  <MyAlbumsHeader title="Kho album" showOrdersButton />
                ),
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="[id]/index"
              options={{
                header: () => (
                  <MyAlbumsHeader
                    title="Chỉnh album"
                    backTo="/my-albums"
                    showInfoButton
                  />
                ),
                gestureEnabled: false,
              }}
            />
          </Stack>
        </ImageBackground>
      </View>
    </SafeAreaProvider>
  );
}
