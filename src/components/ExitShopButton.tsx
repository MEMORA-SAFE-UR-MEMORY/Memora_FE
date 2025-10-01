import { TouchableOpacity, View } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";

const ExitShopButton = () => {
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <View
        style={{
          borderRadius: 99,
          backgroundColor: "#D6B7FF",
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{}}>
          <Octicons name="x-circle-fill" size={24} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExitShopButton;
