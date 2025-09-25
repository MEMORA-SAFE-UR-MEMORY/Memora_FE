import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Button from "./Button";
import { router } from "expo-router";
import LoadingOverlay from "@src/components/LoadingOverlay";
import { useLogin } from "@src/hooks/useLogin";
import CustomAlert from "./CustomAlert";

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onRegisterPress: () => void;
  onForgotPasswordPress: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  visible,
  onClose,
  onRegisterPress,
  onForgotPasswordPress,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { handleLogin, loading, error } = useLogin();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setShowAlert(false);
    setAlertMessage("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const showCustomAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      showCustomAlert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const result = await handleLogin(email, password);
    if (result) {
      showCustomAlert("Đăng nhập thành công!");
      const timer = setTimeout(() => {
        handleClose();
        onLoginSuccess?.();
        clearTimeout(timer);
      }, 1500);
    } else {
      showCustomAlert(error || "Đăng nhập thất bại!");
    }
  };

  const handleRegisterPress = () => {
    resetForm();
    onRegisterPress();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={handleClose}
          supportedOrientations={["portrait", "landscape"]}
        >
          {loading && <LoadingOverlay />}

          <View
            style={{
              backgroundColor: "white",
              width: 557,
              height: 334,
              marginTop: 40,
              alignSelf: "center",
              borderRadius: 32,
              alignItems: "center",
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: "center",
                }}
                showsVerticalScrollIndicator={false}
              >
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 25,
                    padding: 8,
                    zIndex: 1,
                  }}
                  onPress={handleClose}
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>

                <Text
                  style={{ marginTop: 16, fontSize: 30, fontWeight: "bold" }}
                >
                  Chào mừng quay trở lại!
                </Text>
                <View style={{ marginTop: 18 }}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Username
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Nhập tên đăng nhập của bạn"
                    keyboardType="default"
                    style={{
                      height: 46,
                      width: 493,
                      borderWidth: 1,
                      paddingHorizontal: 20,
                      marginTop: 6,
                      borderRadius: 20,
                    }}
                  />
                </View>
                <View style={{ marginTop: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Mật khẩu
                  </Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Nhập mật khẩu của bạn"
                    keyboardType="default"
                    secureTextEntry={!showPassword}
                    style={{
                      height: 46,
                      width: 493,
                      borderWidth: 1,
                      paddingHorizontal: 20,
                      marginTop: 6,
                      borderRadius: 20,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 20,
                      top: 36,
                    }}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    marginTop: 12,
                    flexDirection: "row",
                    marginLeft: 250,
                    gap: 10,
                  }}
                >
                  <TouchableOpacity onPress={handleRegisterPress}>
                    <Text style={{ textDecorationLine: "underline" }}>
                      Chưa có tài khoản?
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onForgotPasswordPress}>
                    <Text style={{ textDecorationLine: "underline" }}>
                      Quên mật khẩu?
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 12 }}>
                  <Button
                    h={44}
                    w={493}
                    title={loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    color="A6E3FF"
                    onPress={handleSubmit}
                    disabled={loading}
                  />
                </View>
                <CustomAlert
                  visible={showAlert}
                  onClose={() => setShowAlert(false)}
                  message={alertMessage}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LoginModal;
