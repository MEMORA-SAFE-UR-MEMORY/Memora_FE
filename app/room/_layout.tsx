import RoomBg from "@src/components/RoomBg";
import { RoomDraftProvider } from "@src/context/DraftContext";
import { InventoryProvider } from "@src/context/InventoryContext";
import { RoomProvider } from "@src/context/RoomContext";
import { useRoom } from "@src/hooks/useRoom";
import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  // const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const roomId = 15;
  const themeId = 1;
  const type: "private" | "public" = "private";

  const { roomDetail, loading, error } = useRoom(roomId, themeId, type);

  if (loading || !roomDetail)
    return <View style={{ flex: 1, backgroundColor: "blue" }} />;

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>{error}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <RoomProvider roomId={roomId} themeId={1} type="private">
          <RoomDraftProvider roomId={roomId}>
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
          </RoomDraftProvider>
        </RoomProvider>
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
