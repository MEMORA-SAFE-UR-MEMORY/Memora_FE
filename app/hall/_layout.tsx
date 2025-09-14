import { Stack } from "expo-router";
import { ImageBackground } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HallLayout() {
  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require("../../assets/images/background/Room Screen.png")}
        style={{ flex: 1, width: "100%", height: "100%" }}
        resizeMode="cover"
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </ImageBackground>
    </SafeAreaProvider>
  );
}
