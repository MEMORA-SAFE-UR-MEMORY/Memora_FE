import { ActivityIndicator, StyleSheet, View } from "react-native";

const LoadingOverlay = () => {
  return (
    <View style={styles.container}>
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
