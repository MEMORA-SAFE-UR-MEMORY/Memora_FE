import LoadingOverlay from "@src/components/LoadingOverlay";
import RoomBg from "@src/components/RoomBg";
import { RoomDraftProvider } from "@src/context/DraftContext";
import { RoomProvider } from "@src/context/RoomContext";
import { useRoom } from "@src/hooks/useRoom";
import { RoomType } from "@src/types/room";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { themeId } = useLocalSearchParams<{ themeId: string }>();
  const { type } = useLocalSearchParams<{ type: RoomType }>();
  const { mode } = useLocalSearchParams<{ mode: "view" | "edit" }>();
  const { viewType } = useLocalSearchParams<{ viewType: "random" | "list" }>();
  const { back } = useLocalSearchParams<{ back: string }>();

  const roomIdNum = Number(roomId);
  if (isNaN(roomIdNum)) {
    console.warn("roomId không phải số hợp lệ:", roomId);
  }

  const themeIdNum = Number(themeId);
  if (isNaN(themeIdNum)) {
    console.warn("themeId không phải số hợp lệ:", themeId);
  }

  const { roomDetail, loading, error } = useRoom(roomIdNum, themeIdNum, type);

  if (loading || !roomDetail) return <LoadingOverlay />;

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
      <RoomProvider
        roomId={roomIdNum}
        themeId={themeIdNum}
        type={type}
        mode={mode}
        viewType={viewType}
        back={back}
      >
        <RoomDraftProvider roomId={roomIdNum}>
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
        </RoomDraftProvider>
      </RoomProvider>
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
