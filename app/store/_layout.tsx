import { Stack } from "expo-router";
import { ImageBackground, View } from "react-native";

export default function StoreLayout() {
  return (
    <ImageBackground
      source={require("../../assets/images/inHomeScreen/wall.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </View>
    </ImageBackground>
  );
}
