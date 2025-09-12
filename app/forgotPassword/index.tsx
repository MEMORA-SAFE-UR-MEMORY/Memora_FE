import { Text, View } from "react-native";
import React, { Component } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export class forgotPassword extends Component {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 100,
        }}
      >
        <Text style={{ fontSize: 34, fontWeight: "bold" }}>Quên mật khẩu</Text>
      </View>
    );
  }
}

export default forgotPassword;
