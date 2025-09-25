import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  InteractionManager,
  ActivityIndicator,
} from "react-native";
import BlurBox from "@src/components/BlurBox";
import { AntDesign } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import LoginModal from "@src/components/LoginModal";
import RegisterModal from "@src/components/RegisterModal";
import { router } from "expo-router";
import { useAuth } from "@src/hooks/useAuth";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loading } = useAuth();

  const handleRegisterPress = useCallback(() => {
    setTimeout(() => {
      setRegisterVisible(true);
    }, 100);
    setModalVisible(false);
  }, []);

  const handleLoginPress = useCallback(() => {
    setTimeout(() => {
      setModalVisible(true);
    }, 100);
    setRegisterVisible(false);
  }, []);

  const handleForgotPassword = useCallback(() => {
    setTimeout(() => {
      setModalVisible(false);
    }, 100);
    router.push("/forgotPassword");
  }, []);

  const handleLogin = useCallback(() => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setModalVisible(false);
      // Alert.alert("Đăng nhập thành công", "Chào mừng quay lại!", [
      //   {
      //     text: "OK",
      //     onPress: () => router.push("/welcome"),
      //   },
      // ]);
      InteractionManager.runAfterInteractions(() => {
        router.replace("/welcome");
      });
    }, 3000);
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#A6E3FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <View>
        <Image source={require("../assets/images/Logo.png")} />
      </View> */}

      <View
        style={{
          marginTop: 320,
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <BlurBox
            h={43}
            w={259}
            title="Đăng nhập bằng Google"
            image={require("../assets/images/google-icon.png")}
            imageSize={24}
            textSize={16}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <BlurBox h={43} w={259} title="Chơi ngay" textSize={16} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          justifyContent: "center",
          marginTop: 5,
        }}
      >
        <AntDesign name="copyright" size={20} color="black" />
        <Text>2025. Memora Corp. All Rights Reserved</Text>
      </View>
      <LoginModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRegisterPress={handleRegisterPress}
        onForgotPasswordPress={handleForgotPassword}
        onLoginSuccess={handleLogin}
      />
      <RegisterModal
        visible={registerVisible}
        onClose={() => setRegisterVisible(false)}
        onLoginPress={handleLoginPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});
