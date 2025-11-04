import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BlurBox from "@src/components/BlurBox";
import CustomAlert from "@src/components/CustomAlert";
import LoadingOverlay from "@src/components/LoadingOverlay";
import LoginModal from "@src/components/LoginModal";
import RegisterModal from "@src/components/RegisterModal";
import { useAuth } from "@src/hooks/useAuth";
import { useUser } from "@src/hooks/useUser";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loading } = useAuth();
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { getUserById } = useUser();

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

  const showCustomAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handlePopUp = () => {
    showCustomAlert("Tính năng chưa được hỗ trợ!");
  };

  const handleLogin = useCallback(async () => {
    try {
      setIsLoading(true);

      // Kiểm tra user data
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) {
        showCustomAlert("Đăng nhập thất bại");
        return;
      }

      const userData = JSON.parse(userStr);
      const supabaseUser = await getUserById(userData.id);

      if (!supabaseUser) {
        showCustomAlert("Không tìm thấy thông tin người dùng");
        return;
      }

      const emailUsername = supabaseUser.email.split("@")[0];
      const userUsername = supabaseUser.username.split("@")[0];

      // Lưu target navigation

      const navigate = userUsername === emailUsername ? "/username" : "/home";

      // Chuyển sang loading screen
      setModalVisible(false);
      router.replace(navigate);
    } catch (error) {
      console.error("[Login] Error:", error);
      showCustomAlert("Đã có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  }, [getUserById]);

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* <View>
        <Image source={require("../assets/images/Logo.png")} />
      </View> */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
            height: "100%",
            backgroundColor: "transparent",
            alignItems: "flex-end",
          }}
        >
          {/* <TouchableOpacity onPress={handlePopUp}>
            <BlurBox
              h={43}
              w={259}
              title="Đăng nhập bằng Google"
              image={require("../assets/images/google-icon.png")}
              imageSize={24}
              textSize={16}
            />
          </TouchableOpacity> */}
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
          <AntDesign name="copyright" size={16} color="black" />
          <Text
            style={{
              fontFamily: "Baloo2_medium",
              fontSize: 12,
              marginBottom: 24,
            }}
          >
            2025. Memora Corp. All Rights Reserved
          </Text>
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
        <CustomAlert
          visible={showAlert}
          onClose={() => setShowAlert(false)}
          message={alertMessage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    gap: 4,
    justifyContent: "center",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});
