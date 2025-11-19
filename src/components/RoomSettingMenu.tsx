import {
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

type Props = {
  modalWidth: number;
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
  MaterialCommunityIcons,
};

const RoomSettingMenu = ({ modalWidth, selected, setSelected }: Props) => {
  const { width, height } = useWindowDimensions();

  // State
  const menuRight = modalWidth - 10;

  // Mock
  const actions: Action[] = [
    {
      id: 1,
      name: "Truy cập",
      iconPackage: "MaterialCommunityIcons",
      iconName: "key",
      size: 26,
    },
    {
      id: 2,
      name: "Mời tham quan",
      iconPackage: "FontAwesome6",
      iconName: "user-plus",
      size: 23,
    },
  ];

  return (
    <View style={[styles.container, { right: menuRight }]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  menuContainer: {
    padding: 10,
    paddingRight: 18,
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

export default RoomSettingMenu;
