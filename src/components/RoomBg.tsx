import React from "react";
import { Image, StyleSheet, View } from "react-native";

type Props = {
  wallUrl: any; // ImageSourcePropType
  floorUrl: any; // ImageSourcePropType
  children?: React.ReactNode;
};

const RoomBg = ({ wallUrl, floorUrl, children }: Props) => {
  return (
    <View style={styles.container}>
      {/* Wall */}
      <Image source={wallUrl} style={styles.wall} resizeMode="cover" />

      {/* Floor */}
      <Image source={floorUrl} style={styles.floor} resizeMode="cover" />

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
