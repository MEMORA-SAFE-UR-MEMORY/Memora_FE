import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import LoadingOverlay from "./LoadingOverlay";

type Props = {
  wallUrl: any; // ImageSourcePropType
  floorUrl: any; // ImageSourcePropType
  children?: React.ReactNode;
};

const RoomBg = ({ wallUrl, floorUrl, children }: Props) => {
  const [wallLoaded, setWallLoaded] = React.useState(false);
  const [floorLoaded, setFloorLoaded] = React.useState(false);
  const [wallError, setWallError] = React.useState(false);
  const [floorError, setFloorError] = React.useState(false);

  React.useEffect(() => {
    Image.getSize(
      wallUrl,
      (width, height) => setWallLoaded(true),
      () => setWallError(true)
    );
    Image.getSize(
      floorUrl,
      (width, height) => setFloorLoaded(true),
      () => setFloorError(true)
    );
  }, [wallUrl, floorUrl]);

  if (wallError || floorError) return <Text>Không có ảnh</Text>;
  if (!wallLoaded || !floorLoaded) return <LoadingOverlay />;

  return (
    <View style={styles.container}>
      {/* Wall */}
      <Image source={{ uri: wallUrl }} style={styles.wall} resizeMode="cover" />

      {/* Floor */}
      <Image
        source={{ uri: floorUrl }}
        style={styles.floor}
        resizeMode="cover"
      />

      {/* Nội dung trong phòng */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  wall: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  floor: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "140%",
    zIndex: 2,
  },
  content: {
    flex: 1,
    zIndex: 3,
  },
});

export default RoomBg;
