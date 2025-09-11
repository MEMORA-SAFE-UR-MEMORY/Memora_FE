import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (username.trim()) {
      // Giả sử login thành công → chuyển tới Home
      router.replace("/");
    } else {
      alert("Please enter a username");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Forgot Password"
        onPress={() => router.replace("/forgotPassword")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, width: "80%", padding: 10, marginBottom: 20 },
});
