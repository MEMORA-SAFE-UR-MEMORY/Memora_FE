import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Button from "./Button";
import { useRegister } from "@src/hooks/useRegister";
import CustomAlert from "./CustomAlert";

interface RegisterModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginPress: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  visible,
  onClose,
  onLoginPress,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { handleRegister, loading, error } = useRegister();

  // Thêm hàm reset form
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowAlert(false);
    setAlertMessage("");
  };

  // Modify onClose handler
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
    if (password !== confirmPassword) {
      showCustomAlert("Mật khẩu xác nhận không khớp!");
      return;
    }

    const result = await handleRegister(email, password);
    if (result) {
      showCustomAlert("Đăng ký thành công!");
      setShowAlert(true);
      // Close modal after alert is closed
      const timer = setTimeout(() => {
        handleClose(); // Thay vì onClose()
        clearTimeout(timer);
      }, 1500);
    } else {
      showCustomAlert(error || "Đăng ký thất bại!");
    }
  };

  // Modify để handle login press với reset form
  const handleLoginPress = () => {
    resetForm();
    onLoginPress();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={handleClose} // Thay đổi này
          supportedOrientations={["portrait", "landscape"]}
        >
          <View style={styles.modalContainer}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose} // Thay đổi này
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Tạo tài khoản mới!</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Nhập tên đăng nhập của bạn"
                    keyboardType="default"
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Mật khẩu</Text>
                  <View>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Nhập mật khẩu của bạn"
                      secureTextEntry={!showPassword}
                      style={styles.input}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={24}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Xác nhận mật khẩu</Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Nhập lại mật khẩu của bạn"
                    secureTextEntry={!showConfirmPassword}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIconConfirm}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye-off" : "eye"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleLoginPress}>
                  {/* Thay đổi này */}
                  <Text style={styles.linkText}>
                    Đã có tài khoản? Đăng nhập
                  </Text>
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                  <Button
                    h={44}
                    w={493}
                    title={loading ? "Đang đăng ký..." : "Đăng ký"}
                    color="A6E3FF"
                    onPress={handleSubmit}
                    disabled={loading}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
          <CustomAlert
            visible={showAlert}
            onClose={() => setShowAlert(false)}
            message={alertMessage}
          />
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    width: 557,
    height: 368,
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 32,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    height: 46,
    width: 493,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: 10,
  },
  eyeIconConfirm: {
    position: "absolute",
    right: 20,
    top: 36,
  },
  linkText: {
    textDecorationLine: "underline",
    marginTop: 10,
    marginLeft: 300,
  },
  buttonContainer: {
    marginTop: 20,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 8,
    zIndex: 1,
  },
});

export default RegisterModal;
