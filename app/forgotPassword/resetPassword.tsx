import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import InputBox from "@src/components/InputBox";
import Button from "@src/components/Button";
import { useForgotPassword } from "@src/hooks/useForgotPassword";
import CustomAlert from "@src/components/CustomAlert";

const ResetPassword = () => {
  const { email } = useLocalSearchParams(); // lấy email từ bước trước
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading, error, handleResetPassword } = useForgotPassword();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showCustomAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };
  const handleReset = async () => {
    if (password.length < 6) {
      showCustomAlert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      showCustomAlert("Mật khẩu nhập lại không khớp");
      return;
    }

    const res = await handleResetPassword(email as string, password);
    if (res === 200) {
      showCustomAlert("Đặt lại mật khẩu thành công!");
      setTimeout(() => {
        router.replace("/");
      }, 500);
    } else {
      showCustomAlert(error || "Có lỗi xảy ra");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
            backgroundColor: "rgba(255,255,255,0.6)",
          }}
        >
          <ActivityIndicator size="large" color="#D2A4FF" />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 80,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 34,
              fontWeight: "bold",
              fontFamily: "Baloo2-Bold",
            }}
          >
            Đặt lại mật khẩu
          </Text>
        </View>

        {/* Subtitle */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 8,
            paddingHorizontal: 24,
          }}
        >
          <Text
            style={{
              fontWeight: "200",
              fontFamily: "Baloo2-Regular",
              textAlign: "center",
            }}
          >
            Nhập mật khẩu mới của bạn và xác nhận lại để hoàn tất quá trình khôi
            phục tài khoản
          </Text>
        </View>

        {/* Input Password */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 50,
          }}
        >
          <InputBox
            title={"Mật khẩu mới"}
            inside={"Nhập mật khẩu mới"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Confirm Password */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <InputBox
            title={"Xác nhận mật khẩu"}
            inside={"Nhập lại mật khẩu"}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        {/* Button Reset */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Button
            h={44}
            w={493}
            title={"Xác nhận đổi mật khẩu"}
            color={"#A6E3FF"}
            onPress={handleReset}
            disabled={loading || password.length === 0}
          />
        </View>

        {/* Back to login */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          <TouchableOpacity onPress={() => router.replace("/")}>
            <Text style={{ fontFamily: "Baloo2-Regular" }}>
              Quay lại <Text style={{ color: "#E41ABF" }}>đăng nhập</Text>
            </Text>
          </TouchableOpacity>
        </View>
        <CustomAlert
          visible={showAlert}
          onClose={() => setShowAlert(false)}
          message={alertMessage}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;
