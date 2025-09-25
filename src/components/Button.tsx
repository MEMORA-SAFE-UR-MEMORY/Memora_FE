import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

interface ButtonProps {
  h: number;
  w: number;
  title: string;
  color: string;
  onPress?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  h,
  w,
  title,
  color,
  onPress,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { height: h, width: w, backgroundColor: `#${color}` },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  disabled: {
    backgroundColor: "#d3d3d3",
  },
});

export default Button;
