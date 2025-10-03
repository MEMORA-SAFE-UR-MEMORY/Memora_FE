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

const ConfirmOTP = () => {
  const [otp, setOtp] = useState("");
  const { email } = useLocalSearchParams<{ email: string }>();

  const { loading, error, handleVerifyOTP } = useForgotPassword();

  const handleConfirmOTP = async () => {
    const ok = await handleVerifyOTP(otp);
    if (ok) {
      router.push({
        pathname: "/forgotPassword/resetPassword",
        params: { email },
      });
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
            Xác nhận OTP
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
            Nhập mã OTP mà chúng tôi đã gửi tới email của bạn để tiếp tục đặt
            lại mật khẩu
          </Text>
        </View>

        {/* Input OTP */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 50,
          }}
        >
          <InputBox
            title={"Mã OTP"}
            inside={"Nhập mã OTP"}
            value={otp}
            onChangeText={setOtp}
          />
        </View>

        {/* Button Confirm */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          <Button
            h={44}
            w={493}
            title={"Xác nhận OTP"}
            color={"#A6E3FF"}
            onPress={handleConfirmOTP}
            disabled={loading || otp.length === 0}
          />
        </View>

        {/* Back to Forgot */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          <TouchableOpacity onPress={() => router.replace("/forgotPassword")}>
            <Text style={{ fontFamily: "Baloo2-Regular" }}>
              Quay lại <Text style={{ color: "#E41ABF" }}>quên mật khẩu</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ConfirmOTP;
