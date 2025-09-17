import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
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
import ScrollingText from "./ScrollingText";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const AddMemoryModal: React.FC<Props> = ({ visible, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setTitle("");
    setDescription("");
    onClose();
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
                    <TouchableOpacity style={styles.dateButton}>
                      <Text style={styles.dateButtonText}>Năm ▼</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dateButton}>
                      <Text style={styles.dateButtonText}>Tháng ▼</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dateButton}>
                      <Text style={styles.dateButtonText}>Ngày ▼</Text>
                    </TouchableOpacity>
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
                <TouchableOpacity style={styles.fileButton}>
                  <Text style={styles.fileButtonText}>Nhập ở đây ▼</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.addButton} onPress={handleSave}>
                <Text style={styles.addButtonText}>Thêm</Text>
              </TouchableOpacity>
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
    right: -10,
    top: -10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
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
    padding: 10,
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
    padding: 5,
    borderRadius: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dateButtonText: {
    color: "#333333",
    textAlign: "center",
    textAlignVertical: "center",
    fontFamily: "Baloo2_medium",
    fontSize: 14,
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
    padding: 10,
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
  addButton: {
    backgroundColor: "#FFBCDD",
    padding: 5,
    borderRadius: 25,
    alignItems: "center",
    width: 100,
    alignSelf: "flex-end",
    borderColor: "#EC4F9D",
    borderBottomWidth: 3,
    borderRightWidth: 2,
    borderLeftWidth: 0.5,
  },
  addButtonText: {
    fontFamily: "Baloo2_semiBold",
    fontSize: 15,
  },
});

export default AddMemoryModal;
