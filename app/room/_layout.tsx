import RoomBg from "@src/components/RoomBg";
import { InventoryProvider } from "@src/context/InventoryContext";
import { useRoom } from "@src/hooks/useRoom";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const id = 1;
  const { roomDetail, loading, getRoomDetail } = useRoom();

  useEffect(() => {
    getRoomDetail(id);
  }, [id]);

  if (loading || !roomDetail) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <InventoryProvider>
          <RoomBg
            wallUrl={roomDetail.theme.wallUrl}
            floorUrl={roomDetail.theme.floorUrl}
          >
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
                animation: "fade",
              }}
            />
          </RoomBg>
        </InventoryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
