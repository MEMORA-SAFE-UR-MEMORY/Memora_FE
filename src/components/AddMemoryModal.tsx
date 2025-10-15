import Ionicons from "@expo/vector-icons/Ionicons";
import BtnBorder from "@src/components/BtnBorder";
import ModalCalendar from "@src/components/ModalCalendar";
import ScrollingText from "@src/components/ScrollingText";
import { Memory } from "@src/types/memory";
import { formatDate } from "@src/utils/format";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
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
import ImageCropModal from "@src/components/ImageCropModal";
import { RoomItem } from "@src/types/item";
import { generateTempId } from "@src/utils/idGenerator";
import LoadingOverlay from "@src/components/LoadingOverlay";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (frameId: number, slotId: number, data: Memory) => void;
  frameId: number | null;
  frameItem: RoomItem | null;
  slotId: number | null;
};

const AddMemoryModal: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  frameId,
  frameItem,
  slotId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { width, height } = useWindowDimensions();
  const isSmallDevice = width <= 700;
  const isTablet = width > 1000;

  const scale = (size: number) => {
    if (isSmallDevice) return size * 0.9;
    if (isTablet) return size * 1.2;
    return size; // thiết bị trung bình giữ nguyên
  };

  // Calendar
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
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
    if (keyboardVisible) {
      Keyboard.dismiss();
      setTimeout(() => setIsCalendarOpen(true), 150);
    } else {
      setIsCalendarOpen(true);
    }
  };
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };
  const handleCalendarClose = () => setIsCalendarOpen(false);

  useEffect(() => {
    if (isCalendarOpen) {
      Keyboard.dismiss();
      setIsEditing(false);
    }
  }, [isCalendarOpen]);

  // Ảnh
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      handleOpenCropModal(result.assets[0].uri);
    }
  };

  const handleOpenCropModal = async (imageUri: string) => {
    try {
      setIsLoading(true);

      if (!frameItem?.item?.slots || slotId == null) {
        console.warn("Không có slot hợp lệ để crop ảnh");
        setIsLoading(false);
        return;
      }

      const slots = Array.isArray(frameItem.item.slots[0])
        ? frameItem.item.slots.flat()
        : frameItem.item.slots;

      const slot = slots.find((s) => s.slotId === slotId);
      if (!slot) {
        console.warn("Không tìm thấy slot với id:", slotId);
        setIsLoading(false);
        return;
      }

      // Set ảnh tạm để modal crop sử dụng
      setTempImage(imageUri);

      // Mở modal sau 1 nhịp để đảm bảo render overlay trước
      setTimeout(() => {
        setIsCropOpen(true);
        setIsLoading(false);
      }, 300);
    } catch (err) {
      console.error("Lỗi khi mở crop modal:", err);
      setIsLoading(false);
    }
  };

  const handleCropConfirm = (croppedUri: string) => {
    setSelectedImage(croppedUri);
    setIsCropOpen(false);
  };

  const handleCropCancel = () => {
    setIsCropOpen(false);
    setTempImage(null);
  };

  const handleSave = () => {
    if (frameId == null || slotId == null) return;
    onSave(frameId, slotId, {
      id: generateTempId(),
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
    selectedImage !== null && title.trim().length > 0 && selectedDate !== "";

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
      supportedOrientations={["portrait", "landscape"]}
    >
      {isLoading && <LoadingOverlay />}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            if (isCalendarOpen) handleCalendarClose();
          }}
        >
          <View style={styles.overlay}>
            <View
              style={[
                styles.content,
                {
                  width: isTablet ? "60%" : isSmallDevice ? "90%" : "70%",
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
                    {isEditing && !isCalendarOpen ? (
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
                        onPress={() => {
                          if (!isCalendarOpen) setIsEditing(true);
                        }}
                        disabled={isCalendarOpen}
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
                            width: isTablet ? 500 : width * 0.8,
                            height: height * (isTablet ? 0.5 : 0.4),
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
                  editable={!isCalendarOpen}
                  onFocus={() => {
                    if (isCalendarOpen) Keyboard.dismiss();
                  }}
                />
              </View>

              {/* Ảnh */}
              <View style={styles.fileRow}>
                <Text style={[styles.label, { fontSize: scale(14) }]}>
                  Nhập tập tin:
                </Text>
                {selectedImage ? (
                  <TouchableOpacity
                    onPress={pickImage}
                    disabled={isCalendarOpen || keyboardVisible}
                  >
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
                  </TouchableOpacity>
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
                    disabled={isCalendarOpen || keyboardVisible}
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

            {/* Modal Crop */}
            {tempImage &&
              isCropOpen &&
              frameItem?.item?.slots &&
              slotId !== null &&
              (() => {
                // Dàn phẳng mảng slot
                const slots = Array.isArray(frameItem.item.slots[0])
                  ? frameItem.item.slots.flat()
                  : frameItem.item.slots;

                const slot = slots.find((s) => s.slotId === slotId);

                if (!slot) {
                  console.warn("Không tìm thấy slot với id:", slotId);
                  return null;
                }

                return (
                  <ImageCropModal
                    key={slotId}
                    visible={isCropOpen}
                    imageUri={tempImage}
                    slot={slot}
                    onConfirm={handleCropConfirm}
                    onCancel={handleCropCancel}
                  />
                );
              })()}
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
    flexDirection: "row",
    gap: 10,
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
    gap: 10,
  },
  dateButtonText: {
    color: "#333333",
    fontFamily: "Baloo2_medium",
  },
  calendarContainer: {
    position: "absolute",
    top: -45,
    left: -5,
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
