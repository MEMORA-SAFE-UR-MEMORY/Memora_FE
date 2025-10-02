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
import React, { Component, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import InputBox from "@src/components/InputBox";
import Button from "@src/components/Button";
import { router } from "expo-router";
import useCustomFonts from "@src/hooks/useCustomFonts";
import LoadingOverlay from "@src/components/LoadingOverlay";
import { useForgotPassword } from "@src/hooks/useForgotPassword";

const forgotPassword = () => {
  const [email, setEmail] = useState("");
  const { handleSendForgotOTP, loading, error, success } = useForgotPassword();
  const handleResetPassword = () => {
    handleSendForgotOTP(email);
  };
  useEffect(() => {
    if (success) {
      router.push({
        pathname: "/forgotPassword/confirmOTP",
        params: { email },
      });
    }
  }, [success]);

  return (
    <>
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
              Quên mật khẩu?
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            <Text style={{ fontWeight: "200", fontFamily: "Baloo2-Regular" }}>
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi bạn OTP để lấy lại
              mật khẩu
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 50,
            }}
          >
            <InputBox
              title={"Email"}
              inside={"Nhập email của bạn"}
              value={email}
              onChangeText={setEmail}
            />
          </View>
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
              title={"Gửi mã lấy lại mật khẩu"}
              color={"A6E3FF"}
              onPress={handleResetPassword}
              disabled={loading}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 12,
            }}
          >
            <TouchableOpacity onPress={() => router.replace("/")}>
              <Text style={{ fontFamily: "Baloo2-Regular" }}>
                Đi tới <Text style={{ color: "#E41ABF" }}>đăng nhập</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default forgotPassword;
