import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is Profile Page</Text>
      <Button title="Back Home" onPress={() => router.push("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, marginBottom: 20 },
});
