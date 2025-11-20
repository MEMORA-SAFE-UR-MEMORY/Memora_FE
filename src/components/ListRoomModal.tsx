import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import LoadingOverlay from "@src/components/LoadingOverlay";
import { useAuthContext } from "@src/context/AuthContext";
import { useRoomContext } from "@src/context/RoomContext";
import { useSharedRoom } from "@src/hooks/useSharedRoom";
import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  back: string;
};

const ListRoomModal = ({ visible, onClose, back }: Props) => {
  const { width } = useWindowDimensions();
  const modalWidth = 0.6 * width;

  // State
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  // Hook
  const { user } = useAuthContext();
  const { rooms, loading } = useSharedRoom(user.id);
  const { setRoomContext } = useRoomContext();

  // Handle
  const handleRoomPress = (roomId: number, themeId: number) => {
    setRoomContext({
      roomId: roomId,
      themeId: themeId,
      mode: "view",
      viewType: "list",
      back: back,
    });

    const params = {
      roomId,
      themeId,
      mode: "view",
      viewType: "list",
      back: back,
    };

    router.replace({ pathname: "/room", params });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={["portrait", "landscape"]}
    >
      <View style={styles.overlay}>
        {loading && <LoadingOverlay />}

        <View style={[styles.container, { width: modalWidth }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Chọn phòng</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-circle" size={30} color="#B0B0B0" />
            </TouchableOpacity>
          </View>

          <View style={styles.tableContainer}>
            {/* Header */}
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.headerCell, { flex: 0.2 }]}>
                STT
              </Text>
              <Text style={[styles.cell, styles.headerCell, { flex: 1.8 }]}>
                Tên phòng
              </Text>
              <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
                Người chia sẻ
              </Text>
            </View>

            {/* Content */}
            {loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Đang tải dữ liệu...</Text>
              </View>
            ) : rooms.length > 0 ? (
              <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
              >
                {rooms.map((room, index) => {
                  const isSelected = room.id === selectedRoomId;

                  return (
                    <TouchableOpacity
                      key={room.id}
                      style={[styles.row, isSelected && styles.selectedRow]}
                      onPress={() => {
                        setSelectedRoomId(room.id);
                        setTimeout(() => {
                          handleRoomPress(room.roomShareId, room.themeId);
                        }, 200);
                      }}
                    >
                      <Text
                        style={[
                          styles.cell,
                          { flex: 0.2 },
                          isSelected && styles.selectedText,
                        ]}
                      >
                        {index + 1}
                      </Text>
                      <Text
                        style={[
                          styles.cell,
                          { flex: 1.8 },
                          isSelected && styles.selectedText,
                        ]}
                      >
                        {room.roomName}
                      </Text>
                      <Text
                        style={[
                          styles.cell,
                          { flex: 1 },
                          isSelected && styles.selectedText,
                        ]}
                      >
                        {room.ownerName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <View style={styles.emptyContainer}>
                <FontAwesome5
                  name="exclamation-circle"
                  size={30}
                  color="#666"
                />
                <Text style={styles.emptyText}>
                  Chưa có phòng được tham quan.
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#663530",
    padding: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Baloo2_bold",
    color: "#663530",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    right: -20,
    top: -20,
    padding: 5,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#663530",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 12,
  },
  scrollContainer: { maxHeight: 200 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerRow: {
    backgroundColor: "#663530",
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontFamily: "Baloo2_medium",
    fontSize: 15,
    color: "#333",
  },
  headerCell: {
    fontFamily: "Baloo2_bold",
    color: "#FFE6CC",
  },
  selectedRow: {
    backgroundColor: "#FFE6CC",
  },
  selectedText: {
    color: "#663530",
    fontFamily: "Baloo2_semiBold",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    gap: 5,
  },
  emptyText: {
    fontFamily: "Baloo2_semiBold",
    fontSize: 15,
    color: "#666",
  },
});

export default ListRoomModal;
