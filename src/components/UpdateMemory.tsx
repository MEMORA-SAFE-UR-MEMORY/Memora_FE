import { Ionicons } from "@expo/vector-icons";
import BtnBorder from "@src/components/BtnBorder";
import ModalCalendar from "@src/components/ModalCalendar";
import ScrollingText from "@src/components/ScrollingText";
import { Memory } from "@src/types/memory";
import { formatDate } from "@src/utils/format";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Props = {
  memory: Memory;
  onUpdate: (data: Memory) => void;
};

const UpdateMemory = ({ memory, onUpdate }: Props) => {
  const id = memory.id;
  const [title, setTitle] = useState(memory.title);
  const [description, setDescription] = useState(memory.description ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    memory.image ?? null
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(memory.date);

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
  const handleUpdate = () => {
    const updatedMemory = {
      id,
      title,
      description,
      image: selectedImage,
      date: selectedDate,
    };
    onUpdate(updatedMemory);
  };

  // Kiểm tra form hợp lệ
  const isFormValid = () => {
    return title.trim() !== "" && selectedDate !== "" && selectedImage !== null;
  };

  // Kiểm tra có thay đổi không
  const isChanged = () => {
    return (
      title !== memory.title ||
      description !== memory.description ||
      selectedImage !== memory.image ||
      selectedDate !== memory.date
    );
  };

  // Trạng thái cho nút update
  const canUpdate = isFormValid() && isChanged();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Text style={styles.titleText}>Cập nhật</Text>

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
                <Text style={styles.characterCount}>{title.length}/50</Text>
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
                    {formatDate(selectedDate)}
                  </Text>
                  <Text style={styles.dateButtonText}>▼</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.descriptionRow}>
            <Text style={styles.label}>Miêu tả</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={[
                styles.descriptionInput,
                description.trim() === "" && styles.placeholderText,
              ]}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="Không có miêu tả"
            />
          </View>

          <View style={styles.fileRow}>
            <Text style={styles.label}>Nhập tập tin: </Text>
            {selectedImage ? (
              <TouchableOpacity
                onPress={pickImage}
                style={styles.imageContainer}
              >
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.thumbnailImage}
                />
                <Ionicons
                  name="camera"
                  size={18}
                  color="#fff"
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.fileButton} onPress={pickImage}>
                <Text style={styles.fileButtonText}>Nhập ở đây ▼</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.updateBtn}>
            <BtnBorder
              text="Cập nhật"
              fontSize={14}
              width={110}
              colorType={canUpdate ? "pink" : "grey"}
              onPress={handleUpdate}
              disabled={!canUpdate}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontFamily: "Baloo2_bold",
    fontSize: 18,
    color: "#5C4D90",
    textAlign: "center",
    padding: 5,
    marginBottom: 10,
  },
  inputRow: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  placeholderText: {
    color: "#999",
    fontFamily: "Baloo2_medium",
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
  imageContainer: {
    position: "relative",
  },
  thumbnailImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    padding: 2,
  },
  updateBtn: {
    alignSelf: "flex-end",
    marginRight: 10,
  },
});

export default UpdateMemory;
