import { FontAwesome6 } from "@expo/vector-icons";
import { Memory } from "@src/types/memory";
import { formatDate } from "@src/utils/format";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Props = {
  memory: Memory;
};

const InfoMemory = ({ memory }: Props) => {
  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.infoText}>THÔNG TIN</Text>
        <Text style={styles.titleText}>{memory.title}</Text>
        <View style={styles.dateRow}>
          <FontAwesome6 name="calendar" size={20} color="black" />
          <Text style={styles.dateText}>{formatDate(memory.date)}</Text>
        </View>
      </View>

      <View style={styles.descContainer}>
        {memory.description.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.descText}>{memory.description}</Text>
          </ScrollView>
        ) : (
          <View style={styles.descEmptyContainer}>
            <FontAwesome6 name="file-lines" size={35} color="#999" />
            <Text style={styles.emptyDescText}>Không có miêu tả</Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontFamily: "Baloo2",
    fontSize: 13,
    textAlign: "center",
  },
  titleText: {
    fontFamily: "Baloo2_bold",
    fontSize: 16,
    color: "#5C4D90",
    paddingHorizontal: 10,
  },
  dateRow: {
    flexDirection: "row",
    gap: 10,
  },
  dateText: {
    fontFamily: "Baloo2_medium",
    fontSize: 12,
  },
  descContainer: {
    flex: 1,
    padding: 5,
  },
  descText: {
    fontFamily: "Baloo2",
    fontSize: 13,
  },
  descEmptyContainer: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyDescText: {
    fontFamily: "Baloo2",
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
  },
});

export default InfoMemory;
