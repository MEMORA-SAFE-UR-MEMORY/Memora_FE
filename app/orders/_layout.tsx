import MyAlbumsHeader from "@src/components/album/MyAlbumsHeader";
import { Slot } from "expo-router";
import { ImageBackground, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function OrdersLayout() {
  const bg = require("../../assets/images/album/album_bg.jpg");
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <ImageBackground source={bg} resizeMode="cover" style={{ flex: 1 }}>
          <MyAlbumsHeader title="Đơn hàng" backTo="/album" />
          <Slot />
        </ImageBackground>
      </View>
    </SafeAreaProvider>
  );
}
