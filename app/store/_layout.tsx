import { Stack } from "expo-router";
import { ImageBackground, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function StoreLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
        }}
      />
    </SafeAreaProvider>
  );
}
