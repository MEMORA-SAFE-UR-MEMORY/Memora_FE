import { Text, View } from "react-native";
import React, { Component } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export class forgotPassword extends Component {
  render() {
    return (
      <SafeAreaProvider>
        <View>
          <Text>forgotPassword</Text>
        </View>
      </SafeAreaProvider>
    );
  }
}

export default forgotPassword;
