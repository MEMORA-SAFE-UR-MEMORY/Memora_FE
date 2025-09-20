import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  modalWidth: number;
  slideAnim: Animated.Value;
  selected: number;
  setSelected: (id: number) => void;
};

type Action = {
  id: number;
  name: string;
  iconPackage: string;
  iconName: string;
  size: number;
};

const iconComponents: Record<string, any> = {
  FontAwesome6,
  MaterialIcons,
};

const ModalMenu = ({ modalWidth, slideAnim, selected, setSelected }: Props) => {
  const actions: Action[] = [
    {
      id: 1,
      name: "Xem",
      iconPackage: "FontAwesome6",
      iconName: "circle-info",
      size: 26,
    },
    {
      id: 2,
      name: "Sửa",
      iconPackage: "FontAwesome6",
      iconName: "pencil",
      size: 23,
    },
    {
      id: 3,
      name: "Xóa",
      iconPackage: "MaterialIcons",
      iconName: "delete-forever",
      size: 27,
    },
  ];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          right: modalWidth,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      {actions.map((action) => {
        const IconComponent = iconComponents[action.iconPackage];
        const isSelected = selected === action.id;
        return (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.menuContainer,
              isSelected ? styles.menuSelected : styles.menuUnselected,
            ]}
            onPress={() => setSelected(action.id)}
          >
            <IconComponent
              name={action.iconName}
              size={action.size}
              color="white"
            />
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
  },
  menuContainer: {
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  menuUnselected: {
    backgroundColor: "#E9D8FF",
  },
  menuSelected: {
    backgroundColor: "#5C4D90",
  },
});

export default ModalMenu;
