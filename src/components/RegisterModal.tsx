import { Ionicons } from "@expo/vector-icons";
import { useRegister } from "@src/hooks/useRegister";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "./Button";
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
      // Close modal after alert is closed
      const timer = setTimeout(() => {
        setShowAlert(false);
        clearTimeout(timer);
        setTimeout(() => {
          handleClose();
        }, 300);
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
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email của bạn"
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
                    name={showPassword ? "eye" : "eye-off"}
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
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleLoginPress}>
              {/* Thay đổi này */}
              <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <Button
                h={44}
                w={493}
                title={loading ? "Đang đăng ký..." : "Đăng ký"}
                color="7c3aed"
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
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    width: 580,
    height: "90%",
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 32,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontFamily: "Baloo2_semiBold",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#7c3aed",
    fontFamily: "Baloo2_medium",
  },
  input: {
    height: 46,
    width: 493,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    fontFamily: "Baloo2_medium",
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: 10,
  },
  eyeIconConfirm: {
    position: "absolute",
    right: 20,
    top: 42,
  },
  linkText: {
    textDecorationLine: "underline",
    marginTop: 2,
    marginLeft: 300,
    fontFamily: "Baloo2_medium",
  },
  buttonContainer: {
    marginTop: 10,
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
