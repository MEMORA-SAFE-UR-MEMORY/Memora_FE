import { Ionicons } from "@expo/vector-icons";
import BtnBorder from "@src/components/BtnBorder";
import ModalCalendar from "@src/components/ModalCalendar";
import ScrollingText from "@src/components/ScrollingText";
import { RoomItem } from "@src/types/item";
import { Memory } from "@src/types/memory";
import { formatDate } from "@src/utils/format";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
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
import ImageCropModal from "@src/components/ImageCropModal";

type Props = {
  memory: Memory;
  frameItem: RoomItem | null;
  slotId: number | null;
  onUpdate: (data: Memory) => void;
  onLoadingChange?: (loading: boolean) => void;
};

const UpdateMemory = ({
  memory,
  frameItem,
  slotId,
  onUpdate,
  onLoadingChange,
}: Props) => {
  const id = memory.id;
  const [title, setTitle] = useState(memory.title);
  const [description, setDescription] = useState(memory.description ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    memory.image ?? null
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(memory.date);

  // === Crop State ===
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

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

  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
  };

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
      onLoadingChange?.(true);

      if (!frameItem?.item?.slots || slotId == null) {
        console.warn("Không có slot hợp lệ để crop ảnh");
        onLoadingChange?.(false);
        return;
      }

      const slots = Array.isArray(frameItem.item.slots[0])
        ? frameItem.item.slots.flat()
        : frameItem.item.slots;

      const slot = slots.find((s) => s.slotId === slotId);
      if (!slot) {
        console.warn("Không tìm thấy slot với id:", slotId);
        onLoadingChange?.(false);
        return;
      }

      // Set ảnh tạm để modal crop sử dụng
      setTempImage(imageUri);

      // Mở modal sau 1 nhịp để đảm bảo render overlay trước
      setTimeout(() => {
        setIsCropOpen(true);
        onLoadingChange?.(false);
      }, 300);
    } catch (err) {
      console.error("Lỗi khi mở crop modal:", err);
      onLoadingChange?.(false);
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

  // Modal
  const handleUpdate = () => {
    const updatedMemory = {
      id,
      title,
      description,
      image: selectedImage,
      date: selectedDate,
      createdAt: memory.createdAt,
    };
    onUpdate(updatedMemory);
  };

  // Kiểm tra form hợp lệ
  const isFormValid = () => {
    return (
      selectedImage !== null && title.trim().length > 0 && selectedDate !== ""
    );
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
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          if (isCalendarOpen) handleCalendarClose();
        }}
      >
        <View>
          <Text style={styles.titleText}>Cập nhật</Text>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Tựa đề</Text>
            <View style={styles.titleInputContainer}>
              {isEditing && !isCalendarOpen ? (
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
                  onPress={() => {
                    if (!isCalendarOpen) setIsEditing(true);
                  }}
                  disabled={isCalendarOpen}
                >
                  {title.length > 30 ? (
                    <ScrollingText text={title} threshold={30} />
                  ) : (
                    <Text
                      style={[
                        styles.titleInput,
                        title.length === 0 && { color: "#999" },
                      ]}
                    >
                      {title.length === 0 ? "Không có tựa đề" : title}
                    </Text>
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
                    {selectedDate ? formatDate(selectedDate) : "Chọn ngày"}
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
              placeholderTextColor="#999"
              editable={!isCalendarOpen}
              onFocus={() => {
                if (isCalendarOpen) Keyboard.dismiss();
              }}
            />
          </View>

          <View style={styles.fileRow}>
            <Text style={styles.label}>Nhập tập tin: </Text>
            {selectedImage ? (
              <TouchableOpacity
                onPress={pickImage}
                style={styles.imageContainer}
                disabled={isCalendarOpen || keyboardVisible}
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
              <TouchableOpacity
                style={styles.fileButton}
                onPress={pickImage}
                disabled={isCalendarOpen || keyboardVisible}
              >
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

            {/* === Modal Crop === */}
            {tempImage &&
              isCropOpen &&
              frameItem?.item?.slots &&
              slotId !== null &&
              (() => {
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
