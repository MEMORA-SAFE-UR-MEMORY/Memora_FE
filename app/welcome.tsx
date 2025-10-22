import AsyncStorage from "@react-native-async-storage/async-storage"; // Add this
import LoadingOverlay from "@src/components/LoadingOverlay";
import useCustomFonts from "@src/hooks/useCustomFonts";
import { useLogin } from "@src/hooks/useLogin";
import { initDiscoveredRooms } from "@src/services/roomService";
import { router } from "expo-router";
import { useEffect, useState } from "react"; // Add useEffect
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Welcome = () => {
  const fontsLoaded = useCustomFonts();
  const { handleLogout, loading } = useLogin();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const userStr = await AsyncStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData(user);
        }
      } catch (error) {
        console.error("Error getting user from storage:", error);
      }
    };

    getUserFromStorage();
  }, []);

  useEffect(() => {
    const initializeRooms = async () => {
      try {
        await initDiscoveredRooms();
      } catch (error) {
        console.error("Error initializing discovered rooms:", error);
      }
    };

    initializeRooms();
  }, []);

  const handlePlay = async () => {
    try {
      if (navigating) return;
      setNavigating(true);

      // Thêm delay nhỏ để tránh double tap
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.replace("/home");
    } catch (error) {
      console.error("[Welcome] Navigation error:", error);
      setNavigating(false);
    }
  };

  const onLogout = async () => {
    setIsLoggingOut(true);
    await handleLogout();
    setIsLoggingOut(false);
  };

  if (!fontsLoaded) {
    return <LoadingOverlay />;
  }

  return (
    <Pressable style={styles.container} onPress={handlePlay}>
      {isLoggingOut && <LoadingOverlay />}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={onLogout}
        disabled={isLoggingOut}
      >
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>

      <View style={styles.bottomContent} pointerEvents="box-none">
        <View style={styles.startContainer} pointerEvents="none">
          <Text style={styles.startText}>
            Xin chào {userData?.username}, Chạm để bắt đầu.
          </Text>
        </View>

        <Text style={styles.copyText}>
          © 2025. Memora Corp. All Rights Reserved.
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContent: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  startContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginBottom: 15,
  },
  startText: {
    fontFamily: "Baloo2_semiBold",
    fontSize: 22,
    color: "#00000060",
    textShadowColor: "#fff",
    textShadowOffset: { width: -2, height: 1 },
    textShadowRadius: 2,
    opacity: 0.7,
  },
  copyText: {
    fontFamily: "Baloo2",
    color: "#252525",
  },
  logoutButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#A6E3FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 1,
  },
  logoutText: {
    fontFamily: "Baloo2_semiBold",
    color: "#000000",
    fontSize: 16,
  },

  welcomeText: {
    fontFamily: "Baloo2_semiBold",
    fontSize: 18,
    color: "#000000",
    textShadowColor: "#fff",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Welcome;
