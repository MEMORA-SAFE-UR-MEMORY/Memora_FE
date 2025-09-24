import Ionicons from "@expo/vector-icons/Ionicons";
import BtnBorder from "@src/components/BtnBorder";
import ModalCalendar from "@src/components/ModalCalendar";
import ScrollingText from "@src/components/ScrollingText";
import { Memory } from "@src/types/memory";
import { formatDate } from "@src/utils/format";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Memory) => void;
};

const AddMemoryModal: React.FC<Props> = ({ visible, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Calendar
  const handleCalendarOpen = () => {
    setIsCalendarOpen(true);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
  };

  // Ảnh
  const pickImage = async () => {
    // Yêu cầu quyền truy cập vào thư viện ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Xin lỗi, chúng tôi cần quyền truy cập vào thư viện ảnh!");
      return;
    }

    // Mở album ảnh
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Modal
  const handleSave = () => {
    onSave({
      id: Date.now(),
      roomId: 0, 
      title,
      description,
      image: selectedImage,
      date: selectedDate,
      createdAt: new Date().toISOString(),
    });
    setTitle("");
    setDescription("");
    setSelectedImage(null);
    setSelectedDate("");
    onClose();
  };

  const isFormValid = () => {
    return title.trim() !== "" && selectedDate !== "" && selectedImage !== null;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
      supportedOrientations={["portrait", "landscape"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>Thêm kỷ niệm</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close-circle" size={30} color="#B0B0B0" />
                </TouchableOpacity>
              </View>

              <View style={styles.row1}>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Tựa đề</Text>
                  <View style={styles.titleInputContainer}>
                    {isEditing ? (
                      <TextInput
                        value={title}
                        onChangeText={setTitle}
                        style={styles.titleInput}
                        maxLength={50}
                        numberOfLines={1}
                        placeholder="Nhập tựa đề..."
                        placeholderTextColor="#999"
                        onBlur={() => setIsEditing(false)}
                        autoFocus
                      />
                    ) : (
                      <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setIsEditing(true)}
                      >
                        {title.length > 23 ? (
                          <ScrollingText text={title} />
                        ) : (
                          <Text style={styles.titleInput}>{title}</Text>
                        )}
                      </TouchableOpacity>
                    )}
                    {title.length > 0 && (
                      <Text style={styles.characterCount}>
                        {title.length}/50
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.dateRow}>
                  <Text style={styles.label}>Ngày:</Text>
                  <View style={styles.dateInputs}>
                    {isCalendarOpen ? (
                      <View style={styles.calendarContainer}>
                        <ModalCalendar
                          onSelectDate={handleDateSelect}
                          onClose={handleCalendarClose}
                          initialDate={selectedDate}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.dateButton}
                        onPress={handleCalendarOpen}
                      >
                        <Text style={styles.dateButtonText}>
                          {selectedDate
                            ? formatDate(selectedDate)
                            : "Chọn ngày"}
                        </Text>
                        <Text style={styles.dateButtonText}>▼</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.descriptionRow}>
                <Text style={styles.label}>Miêu tả</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  style={styles.descriptionInput}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.fileRow}>
                <Text style={styles.label}>Nhập tập tin: </Text>
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.thumbnailImage}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.fileButton}
                    onPress={pickImage}
                  >
                    <Text style={styles.fileButtonText}>Nhập ở đây ▼</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.addButton}>
                <BtnBorder
                  text="Thêm"
                  fontSize={15}
                  colorType={isFormValid() ? "pink" : "grey"}
                  onPress={handleSave}
                  disabled={!isFormValid()}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    borderColor: "#E9D8FF",
    borderWidth: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Baloo2_bold",
    color: "#5C4D90",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    right: -20,
    top: -20,
    padding: 5,
  },
  row1: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    height: 50,
  },
  inputRow: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  label: {
    fontFamily: "Baloo2_medium",
    fontSize: 15,
    color: "#333",
    marginBottom: 5,
  },
  titleInputContainer: {
    flex: 1,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    height: 40,
    overflow: "hidden",
  },
  scrollingText: {
    fontFamily: "Baloo2_medium",
    fontSize: 14,
    color: "#333",
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: "auto",
  },
  titleInput: {
    paddingHorizontal: 10,
    paddingRight: 45,
    fontFamily: "Baloo2_medium",
    fontSize: 14,
    color: "#333",
  },
  characterCount: {
    position: "absolute",
    right: 10,
    top: 19,
    fontSize: 12,
    color: "#666",
    fontFamily: "Baloo2",
  },
  dateRow: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  dateInputs: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  dateButton: {
    backgroundColor: "#B1E1FF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    height: 40,
  },
  dateButtonText: {
    color: "#333333",
    textAlign: "center",
    textAlignVertical: "center",
    fontFamily: "Baloo2_medium",
    fontSize: 14,
  },
  calendarContainer: {
    position: "absolute",
    top: -50,
    right: -90,
    zIndex: 1000,
    width: 350,
    height: 280,
  },
  descriptionRow: {
    marginBottom: 10,
    flexDirection: "row",
    gap: 10,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 100,
    textAlignVertical: "top",
    fontFamily: "Baloo2_medium",
    fontSize: 14,
    flex: 1,
  },
  fileRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  fileButton: {
    backgroundColor: "#B1E1FF",
    padding: 8,
    borderRadius: 25,
    alignItems: "center",
  },
  fileButtonText: {
    color: "#333333",
    fontFamily: "Baloo2_medium",
    fontSize: 14,
  },
  thumbnailImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addButton: {
    alignSelf: "flex-end",
  },
});

export default AddMemoryModal;
