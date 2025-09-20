import { StyleSheet, Text, TouchableOpacity } from "react-native";

export type ColorType = "grey" | "red" | "green" | "pink";

type Props = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  colorType?: ColorType;
  width?: number;
  height?: number;
  fontSize?: number;
};

const getColors = (type: ColorType) => {
  switch (type) {
    case "red":
      return {
        backgroundColor: "#F75270",
        borderColor: "#DC143C",
        textColor: "white",
      };
    case "green":
      return {
        backgroundColor: "#BDE3C3",
        borderColor: "#79AC78",
        textColor: "black",
      };
    case "pink":
      return {
        backgroundColor: "#FFBCDD",
        borderColor: "#EC4F9D",
        textColor: "black",
      };
    case "grey":
    default:
      return {
        backgroundColor: "#D3D3D3",
        borderColor: "#A9A9A9",
        textColor: "black",
      };
  }
};

const BtnBorder = ({
  text,
  onPress,
  disabled,
  colorType = "grey",
  width = 100,
  height = 45,
  fontSize = 13,
}: Props) => {
  const colors = getColors(colorType);

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          width,
          height,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.btnText, { color: colors.textColor, fontSize }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
  },
  btnText: {
    fontFamily: "Baloo2_medium",
  },
});

export default BtnBorder;
