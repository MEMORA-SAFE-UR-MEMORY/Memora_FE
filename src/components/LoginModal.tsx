import { Ionicons } from "@expo/vector-icons";
import LoadingOverlay from "@src/components/LoadingOverlay";
import useCustomFonts from "@src/hooks/useCustomFonts";
import { useLogin } from "@src/hooks/useLogin";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Button from "./Button";
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
  const fontsLoaded = useCustomFonts();

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

  if (!fontsLoaded) {
    return <LoadingOverlay />;
  }

  const Container = Platform.OS === "ios" ? KeyboardAvoidingView : View;
  const containerProps =
    Platform.OS === "ios"
      ? ({ behavior: "padding", style: { flex: 1 } } as const)
      : ({ style: { flex: 1 } } as const);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      supportedOrientations={["portrait", "landscape"]}
      statusBarTranslucent
      presentationStyle="overFullScreen"
    >
      {loading && <LoadingOverlay />}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={{
            backgroundColor: "white",
            width: "65%",
            height: "93%",
            marginTop: 10,
            alignSelf: "center",
            borderRadius: 32,
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Container {...containerProps}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 10,
              }}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              contentInsetAdjustmentBehavior="never"
              showsVerticalScrollIndicator={false}
              // Android đôi khi cần tắt clipping để tránh nhấp nháy
              removeClippedSubviews={
                Platform.OS === "android" ? false : undefined
              }
            >
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 0,
                  top: 20,
                  padding: 8,
                  zIndex: 1,
                }}
                onPress={handleClose}
              >
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>

              <Text
                style={{
                  marginTop: 16,
                  fontSize: 24,
                  fontFamily: "Baloo2_semiBold",
                }}
              >
                Chào mừng quay trở lại!
              </Text>
              <View style={{ marginTop: 8 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Baloo2_medium",
                    color: "#7c3aed",
                  }}
                >
                  Email
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Nhập email của bạn"
                  keyboardType="default"
                  style={{
                    height: 46,
                    width: 493,
                    borderWidth: 1,
                    paddingHorizontal: 20,
                    marginTop: 6,
                    borderRadius: 20,
                    fontFamily: "Baloo2_medium",
                  }}
                />
              </View>
              <View style={{ marginTop: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Baloo2_medium",
                    color: "#7c3aed",
                  }}
                >
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
                    fontFamily: "Baloo2_medium",
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 20,
                    top: 42,
                  }}
                >
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
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
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      fontFamily: "Baloo2_semiBold",
                    }}
                  >
                    Chưa có tài khoản?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onForgotPasswordPress}>
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      fontFamily: "Baloo2_semiBold",
                    }}
                  >
                    Quên mật khẩu?
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 12 }}>
                <Button
                  h={44}
                  w={493}
                  title={loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  color="7c3aed"
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
          </Container>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LoginModal;
