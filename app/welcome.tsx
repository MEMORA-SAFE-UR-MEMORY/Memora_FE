import {
  Pressable,
  StyleSheet,
  Text,
  View,
  InteractionManager,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react"; // Add useEffect
import useCustomFonts from "@src/hooks/useCustomFonts";
import LoadingOverlay from "@src/components/LoadingOverlay";
import { router } from "expo-router";
import { useLogin } from "@src/hooks/useLogin";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Add this

const Welcome = () => {
  const fontsLoaded = useCustomFonts();
  const { handleLogout, loading } = useLogin();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null);

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

  const handlePlay = () => {
    InteractionManager.runAfterInteractions(() => {
      router.replace("/loading");
    });
  };

  const onLogout = async () => {
    setIsLoggingOut(true);
    await handleLogout();
    setIsLoggingOut(false);
  };

  if (!fontsLoaded) {
    return <LoadingOverlay />;
  }

  if (!userData) {
    await handleLogout();
  }

  return (
    <View style={styles.container}>
      {isLoggingOut && <LoadingOverlay />}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={onLogout}
        disabled={isLoggingOut}
      >
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>

      <View style={styles.bottomContent}>
        <View style={styles.startContainer}>
          <Pressable onPress={handlePlay}>
            <Text style={styles.startText}>
              Xin chào {userData?.username}, Chạm để bắt đầu.
            </Text>
          </Pressable>
        </View>

        <Text style={styles.copyText}>
          © 2025. Memora Corp. All Rights Reserved.
        </Text>
      </View>
    </View>
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
