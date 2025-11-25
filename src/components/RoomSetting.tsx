import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import BtnBorder from "@src/components/BtnBorder";
import LoadingOverlay from "@src/components/LoadingOverlay";
import RoomSettingMenu from "@src/components/RoomSettingMenu";
import { useSharedRoom } from "@src/hooks/useSharedRoom";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import ModalConfirm from "./ModalConfirm";

type Props = {
  visible: boolean;
  roomId: number;
  myUserId: any;
  onClose: () => void;
  onSave: (type: "private" | "public") => void;
  currentType: "private" | "public";
};

type Option = {
  label: string;
  value: "private" | "public";
};

const RoomSetting: React.FC<Props> = ({
  visible,
  roomId,
  myUserId,
  onClose,
  onSave,
  currentType,
}) => {
  // Width, Height
  const { width, height } = useWindowDimensions();
  const modalWidth = 0.5 * width;

  // Mock
  const ops: Option[] = [
    {
      label: "Riêng tư",
      value: "private",
    },
    {
      label: "Công khai",
      value: "public",
    },
  ];

  // State
  const [selected, setSelected] = useState<"private" | "public">(currentType);
  const [selectedMenu, setSelectedMenu] = useState<number>(1);
  const [username, setUsername] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  // Hook
  const { inviteUser, loading } = useSharedRoom();

  // Check
  const isInvitedUser = selectedMenu === 2;
  const isPublic = currentType === "public";
  const hasUsername = username !== "";
  const isValid = isPublic && hasUsername;

  // Handle
  const handleInvite = async () => {
    const res = await inviteUser(username, roomId, myUserId);
    if (res.success) {
      setMsg(res.message);
      setShowSuccess(true);
    } else {
      setMsg(res.message);
      setShowError(true);
    }
  };

  const handleCloseSuccess = () => {
    setUsername("");
    setShowSuccess(false);
    setMsg("");
  };

  const handleCloseError = () => {
    setShowError(false);
    setMsg("");
  };

  // Use Effect
  useEffect(() => {
    setSelected(currentType);
  }, [currentType]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
      supportedOrientations={["portrait", "landscape"]}
    >
      <View style={styles.overlay}>
        {loading && <LoadingOverlay />}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={[styles.container, { width: modalWidth }]}>
                <RoomSettingMenu
                  modalWidth={modalWidth}
                  selected={selectedMenu}
                  setSelected={(id) => {
                    setSelectedMenu(id);
                  }}
                />
                <View style={styles.content}>
                  <View style={styles.header}>
                    <Text style={styles.title}>
                      {isInvitedUser ? "Mời tham quan" : "Cài đặt phòng"}
                    </Text>
                    <TouchableOpacity
                      onPress={onClose}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close-circle" size={30} color="#B0B0B0" />
                    </TouchableOpacity>
                  </View>

                  {!isInvitedUser ? (
                    <>
                      <View style={styles.row}>
                        <Text style={styles.label}>Quyền truy cập:</Text>
                        <View style={styles.opsContainer}>
                          {ops.map((op) => {
                            const isSelected = selected === op.value;
                            return (
                              <View key={op.value} style={styles.opsRow}>
                                <Pressable
                                  style={[
                                    styles.opsUnselected,
                                    isSelected && styles.opsSelected,
                                  ]}
                                  onPress={() => setSelected(op.value)}
                                ></Pressable>
                                <Text style={styles.text}>{op.label}</Text>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                      <View style={styles.noteRow}>
                        <Text style={styles.noteLabel}>Lưu ý: </Text>
                        <Text style={styles.noteValue}>
                          Ở chế độ Riêng tư, ảnh được lưu trong thiết bị của
                          bạn. Nếu bạn xóa ảnh hoặc dữ liệu ứng dụng trên máy,
                          những nội dung này sẽ bị mất vĩnh viễn.
                        </Text>
                      </View>
                      <View style={styles.addButton}>
                        <BtnBorder
                          text="Lưu"
                          fontSize={15}
                          colorType={"pink"}
                          onPress={() => onSave(selected)}
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.inputRow}>
                        <Text style={styles.label}>Tên tài khoản</Text>
                        <View style={styles.inputContainer}>
                          <TextInput
                            value={username}
                            onChangeText={setUsername}
                            style={styles.inputText}
                          />
                        </View>
                      </View>
                      <View style={[styles.noteRow]}>
                        <Text style={styles.noteLabel}>Lưu ý: </Text>
                        <Text style={styles.noteValue}>
                          Chức năng này chỉ có ở chế độ Công khai!
                        </Text>
                      </View>
                      <View style={styles.addButton}>
                        <BtnBorder
                          text="Mời"
                          fontSize={15}
                          colorType={!isValid ? "grey" : "pink"}
                          disabled={!isValid}
                          onPress={handleInvite}
                        />
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {/* Modal Noti */}
        {showSuccess && (
          <ModalConfirm
            visible={showSuccess}
            mode="noti"
            onClose={handleCloseSuccess}
            onConfirm={handleCloseSuccess}
            titleText="Thông báo"
            contentText={msg}
            icon={<FontAwesome5 name="check" size={30} color="white" />}
            iconBgColor="#79AC78"
            confirmBtnText="Đóng"
            confirmBtnColor="grey"
            width={340}
          />
        )}

        {showError && (
          <ModalConfirm
            visible={showError}
            mode="noti"
            onClose={handleCloseError}
            onConfirm={handleCloseError}
            titleText="Thông báo"
            contentText={msg}
            icon={<FontAwesome5 name="exclamation" size={30} color="white" />}
            iconBgColor="#F75270"
            confirmBtnText="Đóng"
            confirmBtnColor="grey"
            width={340}
          />
        )}
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
    width: "50%",
  },
  content: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    borderWidth: 6,
    borderColor: "#E9D8FF",
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  label: {
    fontFamily: "Baloo2_semiBold",
    fontSize: 18,
    color: "#333",
  },
  opsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
  },
  opsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  opsUnselected: {
    borderRadius: 100,
    width: 20,
    height: 20,
    borderWidth: 1,
    backgroundColor: "white",
  },
  opsSelected: {
    backgroundColor: "#FFBCDD",
  },
  text: {
    fontFamily: "Baloo2_medium",
    fontSize: 16,
    color: "#333",
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
    marginBottom: 10,
    marginTop: 5,
  },
  noteLabel: {
    color: "red",
    fontFamily: "Baloo2_semiBold",
  },
  noteValue: {
    color: "#666",
    fontFamily: "Baloo2_medium",
    flex: 1,
    fontSize: 14,
  },
  inputRow: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
  },
  inputText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: "Baloo2_medium",
    fontSize: 14,
    color: "#333",
  },
  addButton: {
    alignSelf: "center",
  },
});

export default RoomSetting;
