import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Home!</Text>
      <Button title="Go to Profile" onPress={() => router.push("/profile")} />
      <Button title="Logout" onPress={() => router.replace("/login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
});
