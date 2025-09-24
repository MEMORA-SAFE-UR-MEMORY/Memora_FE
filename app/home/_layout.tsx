import Cloud from "@src/components/login/Cloud";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeLayout() {
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);

  const BG = require("../../assets/images/loginScreen/nen_troi.png");
  const HOUSE = require("../../assets/images/loginScreen/nhà.png");
  const CLOUD = require("../../assets/images/loginScreen/mây 2.png");

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        {/* BACKGROUND LAYER */}
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
        <View style={StyleSheet.absoluteFill}>
          {/* Nền trời */}
          <Image
            source={BG}
            resizeMode="cover"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              transform: [{ scale: 1 }],
            }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />

          {/* Mây */}
          <Cloud
            source={CLOUD}
            top={-20}
            height={140}
            direction="ltr"
            duration={32000}
            initialDelay={-8000}
          />
          <Cloud
            source={CLOUD}
            top={30}
            height={160}
            direction="rtl"
            duration={32000}
            initialDelay={-10000}
          />
          <Cloud
            source={CLOUD}
            top={20}
            height={180}
            direction="ltr"
            duration={32000}
            initialDelay={-5000}
          />
          <Cloud
            source={CLOUD}
            top={50}
            height={170}
            direction="ltr"
            duration={34000}
            initialDelay={-15000}
          />
          <Cloud
            source={CLOUD}
            top={40}
            height={200}
            direction="rtl"
            duration={33000}
            initialDelay={-8000}
          />
          <Cloud
            source={CLOUD}
            top={70}
            height={165}
            direction="ltr"
            duration={35000}
            initialDelay={-12000}
          />
          <Cloud
            source={CLOUD}
            top={60}
            height={190}
            direction="rtl"
            duration={36000}
            initialDelay={-18000}
          />

          {/* Nhà */}
          <Image
            source={HOUSE}
            resizeMode="contain"
            style={{
              position: "absolute",
              bottom: 0,
              width,
              height: undefined,
              aspectRatio: 1365 / 768,
              alignSelf: "center",
              zIndex: 5,
            }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        </View>

        <View style={{ flex: 1, zIndex: 30 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
          </Stack>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
