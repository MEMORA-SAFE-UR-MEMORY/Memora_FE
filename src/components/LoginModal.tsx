import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose }) => {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Modal
          onBackdropPress={onClose}
          onDismiss={onClose}
          visible={visible}
          onRequestClose={onClose}
          supportedOrientations={["portrait", "landscape"]}
        >
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
            <Text style={{ marginTop: 16, fontSize: 30, fontWeight: "bold" }}>
              Chào mừng quay trở lại!
            </Text>
            <View style={{ marginTop: 18 }}>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>E-mail</Text>
              <TextInput
                onChangeText={onChangeEmail}
                value={email}
                placeholder="Nhập email của bạn"
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
              <Text style={{ fontSize: 16, fontWeight: "500" }}>Mật khẩu</Text>
              <TextInput
                onChangeText={onChangePassword}
                value={password}
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
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LoginModal;
