import { useFonts } from "expo-font";

export default function useCustomFonts() {
  const [fontsLoaded] = useFonts({
    Aclonica: require("../../assets/fonts/Aclonica-Regular.ttf"),
    Baloo2: require("../../assets/fonts/Baloo2-Regular.ttf"),
    Baloo2_medium: require("../../assets/fonts/Baloo2-Medium.ttf"),
    Baloo2_semiBold: require("../../assets/fonts/Baloo2-SemiBold.ttf"),
    Baloo2_bold: require("../../assets/fonts/Baloo2-Bold.ttf"),
    Baloo2_extraBold: require("../../assets/fonts/Baloo2-ExtraBold.ttf"),
  });

  return fontsLoaded;
}
