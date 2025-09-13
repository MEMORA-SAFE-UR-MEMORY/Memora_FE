import {
  Pressable,
  StyleSheet,
  Text,
  View,
  InteractionManager,
} from "react-native";
import useCustomFonts from "@src/hooks/useCustomFonts";
import LoadingOverlay from "@src/components/LoadingOverlay";
import { router } from "expo-router";

const Welcome = () => {
  const fontsLoaded = useCustomFonts();

  const handlePlay = () => {
    InteractionManager.runAfterInteractions(() => {
      router.replace("/loading");
    });
  };

  return (
    <View style={styles.container}>

      {!fontsLoaded && <LoadingOverlay />}

      <View style={styles.bottomContent}>
        <View style={styles.startContainer}>
          <Pressable onPress={handlePlay}>
            <Text style={styles.startText}>Chạm để bắt đầu.</Text>
          </Pressable>
        </View>

        <Text style={styles.copyText}>
          © 2025. Memora Corp. All Rights Reserved.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContent: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  startContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginBottom: 15,
  },
  startText: {
    fontFamily: "Baloo2_semiBold",
    fontSize: 22,
    color: "#00000060",
    textShadowColor: "#fff",
    textShadowOffset: { width: -2, height: 1 },
    textShadowRadius: 2,
    opacity: 0.7,
  },
  copyText: {
    fontFamily: "Baloo2",
    color: "#252525",
  },
});

export default Welcome;
