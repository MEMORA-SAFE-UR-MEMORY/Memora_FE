import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingOverlay from "@src/components/LoadingOverlay";
import useCustomFonts from "@src/hooks/useCustomFonts";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  const hasNavigated = useRef(false);
  const mounted = useRef(true);

  // Xử lý cleanup khi unmount
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  // Xử lý progress animation
  useEffect(() => {
    const animation = Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    });

    animation.start();

    const interval = setInterval(() => {
      if (!mounted.current) return;

      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev + 0.01;
      });
    }, 30);

    return () => {
      clearInterval(interval);
      animation.stop();
    };
  }, []);

  // Xử lý navigation sau khi loading xong
  useEffect(() => {
    let navigationTimer: NodeJS.Timeout;

    const handleNavigation = async () => {
      if (
        progress >= 1 &&
        fontsLoaded &&
        !hasNavigated.current &&
        mounted.current
      ) {
        hasNavigated.current = true;
        console.log("[Loading] Progress complete, preparing navigation...");

        try {
          // Đợi animation hoàn thành
          await new Promise((resolve) => setTimeout(resolve, 1000));

          if (!mounted.current) return;

          // Lấy target navigation từ AsyncStorage
          const navigationTarget =
            await AsyncStorage.getItem("navigationTarget");
          console.log("[Loading] Navigation target:", navigationTarget);

          if (!navigationTarget) {
            console.error("[Loading] No navigation target found");
            router.replace("/");
            return;
          }

          // Navigate to target
          router.replace(navigationTarget);
        } catch (error) {
          console.error("[Loading] Navigation error:", error);
          if (mounted.current) {
            router.replace("/");
          }
        }
      }
    };

    if (progress >= 1 && fontsLoaded) {
      navigationTimer = setTimeout(handleNavigation, 1000);
    }

    return () => {
      if (navigationTimer) {
        clearTimeout(navigationTimer);
      }
    };
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
