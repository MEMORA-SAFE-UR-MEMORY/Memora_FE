import { Entypo } from "@expo/vector-icons";
import LoadingOverlay from "@src/components/LoadingOverlay";
import useCustomFonts from "@src/hooks/useCustomFonts";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import * as Progress from "react-native-progress";

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const progressAnim = new Animated.Value(0);
  const fontsLoaded = useCustomFonts();
  const { width } = useWindowDimensions();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev + 0.01;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();

    if (progress === 1 && fontsLoaded) {
      setTimeout(() => {
        router.replace("/home");
      }, 500);
    }
  }, [progress, fontsLoaded]);

  return (
    <View style={styles.container}>
      {!fontsLoaded && <LoadingOverlay />}
      {/* Hình ảnh */}
      <View style={styles.photoWrapper}>
        <Image
          source={{
            uri: "https://cafefcdn.com/thumb_w/640/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg",
          }}
          style={styles.image}
        />
        <Entypo name="pin" size={32} color="red" style={styles.pin} />
        <Text style={styles.caption}>
          Từng ký ức sẽ trở nên sống động qua từng khung hình
        </Text>
      </View>

      <View style={styles.percentWrapper}>
        <ActivityIndicator size="small" color="#fff" />
        <Text style={[styles.percent, { marginBottom: -10 }]}>
          {Math.round(progress * 100)}%
        </Text>
        <Text style={styles.percent}>Đang tải</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressWrapper}>
        <Progress.Bar
          progress={progress}
          width={width}
          color="#fff"
          unfilledColor="#000"
          borderWidth={0}
          height={12}
          style={{ marginHorizontal: 0 }}
          borderRadius={0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#89D1FD",
    alignItems: "center",
    justifyContent: "center",
  },
  photoWrapper: {
    alignItems: "center",
    transform: [{ rotate: "-3deg" }],
    backgroundColor: "#fff",
  },
  image: {
    width: 250,
    height: 200,
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
  progressWrapper: {
    position: "absolute",
    bottom: -20,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 20,
    overflow: "hidden",
  },
  percentWrapper: {
    position: "absolute",
    bottom: 15,
    right: 20,
    alignItems: "center",
    flexDirection: "column",
    gap: 2,
  },
  percent: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Baloo2_medium",
    textAlign: "center",
  },
});

export default Loading;
