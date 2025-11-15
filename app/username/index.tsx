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
import { router } from "expo-router";
import InputBox from "@src/components/InputBox";
import Button from "@src/components/Button";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@src/utils/supabase";

const Username = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateUsername = async (userId: string, newUsername: string) => {
    const { data, error } = await supabase
      .from("users")
      .update({ username: newUsername })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const handleContinue = async () => {
    if (!username.trim()) return;

    try {
      setLoading(true);
      setError("");

      // Get current user from AsyncStorage
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        throw new Error("User not found");
      }

      const parsedUser = JSON.parse(userData);

      // Update username in Supabase
      const updatedUser = await updateUsername(parsedUser.id, username.trim());

      console.log(updateUsername);

      // Update user data in AsyncStorage
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          ...parsedUser,
          username: username.trim(),
        })
      );

      // Navigate to home
      router.replace("/home");
    } catch (err: any) {
      console.error("Error updating username:", err);
      setError(err.message || "Failed to update username");
    } finally {
      setLoading(false);
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
            Xin chào!
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
              textAlign: "center",
              fontWeight: "200",
              fontFamily: "Baloo2-Regular",
            }}
          >
            Hãy nhập tên người dùng để bắt đầu sử dụng ứng dụng
          </Text>
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <InputBox
            title={"Tên người dùng"}
            inside={"Nhập username của bạn"}
            value={username}
            onChangeText={setUsername}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Button */}
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
            title={"Tiếp tục"}
            color={"A6E3FF"}
            onPress={handleContinue}
            disabled={loading || !username.trim()}
          />
        </View>

        {/* Link to login (optional) */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 50,
  },
  errorText: {
    color: "red",
    marginTop: 8,
    fontFamily: "Baloo2-Regular",
  },
});

export default Username;
