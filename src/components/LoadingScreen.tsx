import { Entypo } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

type LoadingProps = {
  message?: string;
};

const LoadingScreen = ({ message = "Đang tải..." }: LoadingProps) => {
  return (
    <View style={styles.container}>
      {/* Ảnh minh họa */}
      <View style={styles.photoWrapper}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.image}
        />
        <Entypo name="pin" size={32} color="red" style={styles.pin} />
        <Text style={styles.caption}>
          Từng ký ức sẽ trở nên sống động qua từng khung hình
        </Text>
      </View>

      {/* Chỉ còn ActivityIndicator và thông báo */}
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#89D1FD",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  photoWrapper: {
    alignItems: "center",
    transform: [{ rotate: "-3deg" }],
    backgroundColor: "#fff",
  },
  image: {
    width: 220,
    height: 180,
    margin: 20,
  },
  pin: {
    position: "absolute",
    top: -5,
    left: 130,
    transform: [{ rotate: "-20deg" }],
  },
  caption: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    maxWidth: 260,
    fontFamily: "Baloo2_medium",
    marginBottom: 10,
  },
    loadingWrapper: {
      marginTop: 30,
    marginBottom: -10,
    alignItems: "center",
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
    fontFamily: "Baloo2_medium",
  },
});

export default LoadingScreen;
