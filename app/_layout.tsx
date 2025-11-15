import Cloud from "@src/components/login/Cloud";
import OnboardingCarousel from "@src/components/OnboardingCarousel";
import { AuthProvider } from "@src/context/AuthContext";
import { InventoryProvider } from "@src/context/InventoryContext";
import { MusicProvider } from "@src/context/MusicContext";
import { ThemeProvider } from "@src/context/ThemeContext";
import { getHasSeenOnboarding, setHasSeenOnboarding } from "@src/utils/storage";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeLayout() {
  const [loading, setLoading] = useState(true);
  const BG = require("../assets/images/loginScreen/nen_troi.png");
  const HOUSE = require("../assets/images/loginScreen/home.png");
  const CLOUD = require("../assets/images/loginScreen/cloud.png");

  const IMG_AR = 1365 / 768;
  const TARGET_OVERFLOW = 1;
  const houseScaleX = TARGET_OVERFLOW;

  const DROP_RATIO = 0.3;

  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const seen = await getHasSeenOnboarding();
      if (!seen) {
        setShowOnboarding(true);
      }
      setLoading(false);
    })();
  }, []);

  const finishOnboarding = async () => {
    await setHasSeenOnboarding();
    setShowOnboarding(false);
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      (async () => {
        try {
          await NavigationBar.setButtonStyleAsync("light");
          await NavigationBar.setVisibilityAsync("hidden");
        } catch {}
      })();
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <AuthProvider>
        <MusicProvider>
          <ThemeProvider>
            <InventoryProvider>
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
                    initialDelay={-80000}
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
                    initialDelay={-50000}
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
                  {/* Nhà */}
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      aspectRatio: IMG_AR,
                      overflow: "hidden",
                      zIndex: 5,
                    }}
                  >
                    <Image
                      source={HOUSE}
                      resizeMode="contain"
                      style={{
                        width: "100%",
                        height: "100%",
                        transform: [
                          { scaleX: houseScaleX },
                          { translateY: DROP_RATIO * (1 / IMG_AR) * 100 },
                        ],
                        alignSelf: "center",
                      }}
                      onLoadStart={() => setLoading(true)}
                      onLoadEnd={() => setLoading(false)}
                    />
                  </View>
                </View>

                <View style={{ flex: 1, zIndex: 30 }}>
                  {/* Onboarding */}
                  <OnboardingCarousel
                    visible={showOnboarding}
                    onFinish={finishOnboarding}
                    onSkip={() => {
                      finishOnboarding();
                    }}
                  />
                  {/* <Button
                          title="Hiển thị lại Onboarding (debug)"
                          onPress={async () => {
                            await resetOnboardingFlag();
                            setShowOnboarding(true);
                          }}
                        /> */}
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: { backgroundColor: "transparent" },
                      animation: "fade",
                    }}
                  >
                    <Stack.Screen
                      name="index"
                      options={{
                        headerShown: false,
                        gestureEnabled: false,
                        animation: "fade",
                      }}
                    />
                  </Stack>
                </View>
              </View>
            </InventoryProvider>
          </ThemeProvider>
        </MusicProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
