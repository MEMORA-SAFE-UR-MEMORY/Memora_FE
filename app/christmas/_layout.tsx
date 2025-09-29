import { Stack } from "expo-router";
import { ImageBackground, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ChristmasThemeLayout() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}
