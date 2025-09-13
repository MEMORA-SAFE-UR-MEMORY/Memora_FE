import { Stack } from "expo-router";
import { ImageBackground, StyleSheet, } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ImageBackground
        source={{
          uri: "https://w0.peakpx.com/wallpaper/404/720/HD-wallpaper-anime-suzume-no-tojimari.jpg",
        }}
        style={styles.background}
        resizeMode="cover"
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
            animation: "fade",
          }}
        />
      </ImageBackground>
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
