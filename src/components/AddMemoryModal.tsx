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
  useWindowDimensions,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (frameId: number, slotId: number, data: Memory) => void;
  frameId: number | null;
  slotId: number | null;
};

const AddMemoryModal: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  frameId,
  slotId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width > 700;

  /** Hàm scale thông minh theo kích thước màn hình */
  const scale = (size: number) => {
    if (isSmallDevice) return size * 0.9; // nhỏ → giảm nhẹ 10%
    if (isTablet) return size * 1.2; // tablet → tăng nhẹ 20%
    return (width / 375) * size; // mặc định: tỉ lệ theo iPhone 11
  };

  // Calendar
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  React.useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);
  const handleCalendarOpen = () => {
    if (!keyboardVisible) {
      setIsCalendarOpen(true);
    } else {
      Keyboard.dismiss(); 
    }
  };
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };
  const handleCalendarClose = () => setIsCalendarOpen(false);

  // Ảnh
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Xin lỗi, chúng tôi cần quyền truy cập vào thư viện ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const handleSave = () => {
    if (frameId == null || slotId == null) return;
    onSave(frameId, slotId, {
      id: Date.now(),
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

  const isFormValid = () =>
    title.trim() !== "" && selectedDate !== "" && selectedImage !== null;

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
            <View
              style={[
                styles.content,
                {
                  width: isTablet ? "60%" : isSmallDevice ? "90%" : "80%",
                  padding: scale(18),
                  borderWidth: scale(6),
                  borderRadius: scale(20),
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text
                  style={[
                    styles.title,
                    { fontSize: scale(20), textAlign: "center" },
                  ]}
                >
                  Thêm kỷ niệm
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons
                    name="close-circle"
                    size={scale(28)}
                    color="#B0B0B0"
                  />
                </TouchableOpacity>
              </View>

              {/* Row 1: Tiêu đề + Ngày */}
              <View
                style={[
                  styles.row1,
                  {
                    flexDirection: isTablet ? "row" : "column",
                    gap: scale(10),
                  },
                ]}
              >
                {/* Tiêu đề */}
                <View style={styles.inputRow}>
                  <Text style={[styles.label, { fontSize: scale(14) }]}>
                    Tựa đề
                  </Text>
                  <View
                    style={[
                      styles.titleInputContainer,
                      { height: scale(40), borderRadius: scale(20) },
                    ]}
                  >
                    {isEditing ? (
                      <TextInput
                        value={title}
                        onChangeText={setTitle}
                        style={[
                          styles.titleInput,
                          { fontSize: scale(13), paddingHorizontal: scale(10) },
                        ]}
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
                          <Text
                            style={[
                              styles.titleInput,
                              { fontSize: scale(13), paddingHorizontal: 10 },
                            ]}
                          >
                            {title}
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}
                    {title.length > 0 && (
                      <Text
                        style={[
                          styles.characterCount,
                          { fontSize: scale(11), top: scale(17) },
                        ]}
                      >
                        {title.length}/50
                      </Text>
                    )}
                  </View>
                </View>

                {/* Ngày */}
                <View style={styles.dateRow}>
                  <Text style={[styles.label, { fontSize: scale(14) }]}>
                    Ngày:
                  </Text>
                  <View style={styles.dateInputs}>
                    {isCalendarOpen ? (
                      <View
                        style={[
                          styles.calendarContainer,
                          {
                            width: isTablet ? 400 : width * 0.8,
                            height: height * 0.4,
                          },
                        ]}
                      >
                        <ModalCalendar
                          onSelectDate={handleDateSelect}
                          onClose={handleCalendarClose}
                          initialDate={selectedDate}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.dateButton,
                          {
                            height: scale(40),
                            borderRadius: scale(20),
                            paddingHorizontal: scale(10),
                          },
                        ]}
                        onPress={handleCalendarOpen}
                      >
                        <Text
                          style={[
                            styles.dateButtonText,
                            { fontSize: scale(13) },
                          ]}
                        >
                          {selectedDate
                            ? formatDate(selectedDate)
                            : "Chọn ngày"}
                        </Text>
                        <Text
                          style={[
                            styles.dateButtonText,
                            { fontSize: scale(13) },
                          ]}
                        >
                          ▼
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              {/* Miêu tả */}
              <View style={styles.descriptionRow}>
                <Text style={[styles.label, { fontSize: scale(14) }]}>
                  Miêu tả
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  style={[
                    styles.descriptionInput,
                    {
                      height: scale(90),
                      borderRadius: scale(20),
                      fontSize: scale(13),
                    },
                  ]}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Ảnh */}
              <View style={styles.fileRow}>
                <Text style={[styles.label, { fontSize: scale(14) }]}>
                  Nhập tập tin:
                </Text>
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={[
                      styles.thumbnailImage,
                      {
                        width: scale(45),
                        height: scale(45),
                        borderRadius: scale(8),
                      },
                    ]}
                  />
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.fileButton,
                      {
                        borderRadius: scale(20),
                        paddingVertical: scale(6),
                        paddingHorizontal: scale(12),
                      },
                    ]}
                    onPress={pickImage}
                  >
                    <Text
                      style={[styles.fileButtonText, { fontSize: scale(13) }]}
                    >
                      Nhập ở đây ▼
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Nút thêm */}
              <View style={styles.addButton}>
                <BtnBorder
                  text="Thêm"
                  fontSize={scale(14)}
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
    borderColor: "#E9D8FF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: "Baloo2_bold",
    color: "#5C4D90",
  },
  closeButton: {
    position: "absolute",
    right: -15,
    top: -15,
    padding: 5,
  },
  row1: {
    justifyContent: "space-between",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  label: {
    fontFamily: "Baloo2_medium",
    color: "#333",
  },
  titleInputContainer: {
    flex: 1,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  titleInput: {
    color: "#333",
    flex: 1,
  },
  characterCount: {
    position: "absolute",
    right: 10,
    color: "#666",
    fontFamily: "Baloo2",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  dateInputs: {
    flexDirection: "row",
    flex: 1,
  },
  dateButton: {
    backgroundColor: "#B1E1FF",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  dateButtonText: {
    color: "#333333",
    fontFamily: "Baloo2_medium",
  },
  calendarContainer: {
    position: "absolute",
    top: -50,
    right: -90,
    zIndex: 1000,
  },
  descriptionRow: {
    marginVertical: 10,
    flexDirection: "row",
    gap: 10,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    flex: 1,
    fontFamily: "Baloo2_medium",
  },
  fileRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  fileButton: {
    backgroundColor: "#B1E1FF",
    alignItems: "center",
  },
  fileButtonText: {
    color: "#333333",
    fontFamily: "Baloo2_medium",
  },
  thumbnailImage: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addButton: {
    alignSelf: "flex-end",
  },
});

export default AddMemoryModal;
