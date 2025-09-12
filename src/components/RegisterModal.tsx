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
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Button from "./Button";

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

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
          supportedOrientations={["portrait", "landscape"]}
        >
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Tạo tài khoản mới!</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Nhập email của bạn"
                  keyboardType="email-address"
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

              <TouchableOpacity onPress={onLoginPress}>
                <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
              </TouchableOpacity>

              <View style={styles.buttonContainer}>
                <Button h={44} w={493} title="Đăng ký" color="A6E3FF" />
              </View>
            </ScrollView>
          </View>
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
});

export default RegisterModal;
