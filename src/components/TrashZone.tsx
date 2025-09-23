import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type Props = {
  highlighted: boolean;
};

const TrashZone = ({ highlighted }: Props) => {
  return (
    <View
      style={[
        styles.trashZone,
        { backgroundColor: highlighted ? "#FFD6D6" : "#F0F0F0" },
      ]}
    >
      <MaterialCommunityIcons name="trash-can" size={32} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  trashZone: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TrashZone;
