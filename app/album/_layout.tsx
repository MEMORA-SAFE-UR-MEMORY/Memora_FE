import AlbumHeader from "@src/components/album/AlbumHeader";
import { Stack } from "expo-router";
import React from "react";
import { ImageBackground, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function AlbumLayout() {
  const bg = require("../../assets/images/album/album_bg.jpg");
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <ImageBackground source={bg} resizeMode="cover" style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              header: () => <AlbumHeader />,
              contentStyle: { backgroundColor: "transparent" },
              animation: "fade",
            }}
          />
        </ImageBackground>
      </View>
    </SafeAreaProvider>
  );
}
