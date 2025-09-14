import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Component } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import InputBox from "@src/components/InputBox";
import Button from "@src/components/Button";
import { router } from "expo-router";

export class forgotPassword extends Component {
  render() {
    return (
      <>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 100,
              }}
            >
              <Text style={{ fontSize: 34, fontWeight: "bold" }}>
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
              <Text style={{ fontWeight: "200" }}>
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi bạn đường dẫn để
                lấy lại mật khẩu
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 50,
              }}
            >
              <InputBox title={"Email"} inside={"Nhập email của bạn"} />
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
                <Text>
                  Đi tới <Text style={{ color: "#E41ABF" }}>đăng nhập</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    );
  }
}

export default forgotPassword;
