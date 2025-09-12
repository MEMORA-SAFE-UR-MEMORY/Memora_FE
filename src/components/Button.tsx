import { Text, TouchableOpacity, View } from "react-native";

const Button = ({ w, h, title, color }) => {
  return (
    <TouchableOpacity>
      <View
        style={{
          width: w,
          height: h,
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 9999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `#${color}`,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "semibold" }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
