import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const ShopCategory = ({ openCategory }: any) => {
  return (
    <TouchableOpacity
      style={{
        width: 37,
        height: 37,
        backgroundColor: "#D6B7FF",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 60,
        bottom: 15,
      }}
      onPress={openCategory}
    >
      <MaterialIcons name="category" size={25} color="white" />
    </TouchableOpacity>
  );
};

export default ShopCategory;
