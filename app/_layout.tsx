import { MusicProvider } from "@src/context/MusicContext";
import { Stack } from "expo-router";

import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MusicProvider>
        <ImageBackground
          source={require("../assets/images/background.jpg")}
          style={styles.background}
          resizeMode="cover"
        >
          <View>
            <Image
              width={204}
              height={204}
              style={{ position: "absolute", alignSelf: "center", top: 60 }}
              source={require("../assets/images/Logo.png")}
            />
          </View>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
              animation: "fade",
            }}
          />
        </ImageBackground>
      </MusicProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
