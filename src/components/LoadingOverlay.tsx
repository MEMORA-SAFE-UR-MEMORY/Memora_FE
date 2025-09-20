import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const LoadingContent = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        Platform.OS === "ios" && { paddingTop: insets.top },
      ]}
    >
      <View style={styles.overlay}>
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ alignSelf: "center" }}
        />
      </View>
    </View>
  );
};

const LoadingOverlay = () => {
  let hasSafeArea = true;

  // Move hook call outside of try-catch
  try {
    useSafeAreaInsets();
  } catch {
    hasSafeArea = false;
  }

  // Android doesn't need SafeAreaProvider
  if (Platform.OS === "android") {
    return <LoadingContent />;
  }

  // For iOS: wrap with SafeAreaProvider only if needed
  if (!hasSafeArea) {
    return (
      <SafeAreaProvider>
        <LoadingContent />
      </SafeAreaProvider>
    );
  }

  return <LoadingContent />;
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
    elevation: 9999,
  },
  overlay: {
    minWidth: 50,
    minHeight: 50,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default LoadingOverlay;
