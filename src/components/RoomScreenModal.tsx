import { ChevronDown, ChevronUp } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const RoomScreenModal = ({ visible, onClose, onConfirm }: Props) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("default");
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const colorOptions = [
    { id: 1, color: "#ffadad" },
    { id: 2, color: "#ffd6a5" },
    { id: 3, color: "#fdffb6" },
    { id: 4, color: "#caffbf" },
    { id: 5, color: "#9bf6ff" },
    { id: 6, color: "#a0c4ff" },
    { id: 7, color: "#bdb2ff" },
    { id: 8, color: "#ffc6ff" },
    { id: 9, color: "#493b97ff" },
    { id: 10, color: "#310a12ff" },
  ];

  const themeOptions = [
    { id: "default", label: "Mặc định" },
    { id: "birthday", label: "Sinh nhật" },
    { id: "travel", label: "Du lịch" },
    { id: "family", label: "Gia đình" },
    { id: "friend", label: "Bạn bè" },
  ];

  const handleCreateRoom = () => {
    console.log("Creating room:", { roomName, selectedTheme, selectedColor });
    onConfirm();
  };

  return (
    <Modal
      animationType="slide"
      statusBarTranslucent={true}
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      supportedOrientations={["portrait", "landscape"]}
    >
      <SafeAreaView
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            paddingHorizontal: 20,
            paddingVertical: 10,
            width: "100%",
            maxWidth: 515,
            maxHeight: "90%",
            borderWidth: 6,
            borderColor: "#E9D8FF",
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: "Baloo2_medium",
                  fontWeight: "600",
                  fontSize: 24,
                  color: "black",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                Tạo phòng mới
              </Text>
              <TouchableOpacity
                style={{
                  width: 24,
                  height: 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={onClose}
              >
                <Image
                  source={require("../../assets/icons/Delete Icon.png")}
                  style={{ width: 26, height: 26 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Room Name Input */}
            <View>
              <Text
                style={{
                  fontFamily: "Baloo2_medium",
                  fontWeight: "600",
                  fontSize: 16,
                  color: "black",
                  marginBottom: 2,
                }}
              >
                Nhập tên không gian ký ức
              </Text>
              <TextInput
                style={{
                  height: 50,
                  backgroundColor: "#f8f8f8",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  fontSize: 16,
                  color: "black",
                  fontFamily: "Baloo2_medium",
                  fontWeight: "500",
                  borderWidth: 2,
                  borderColor: "#E9D8FF",
                  textAlignVertical: "center",
                }}
                value={roomName}
                onChangeText={setRoomName}
                placeholder="Ví dụ: Nhà Tanjirou"
                placeholderTextColor="#666"
              />
            </View>

            {/* Theme Selection */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: "Baloo2_medium",
                  fontWeight: "600",
                  fontSize: 16,
                  color: "black",
                  marginBottom: 2,
                  marginTop: 4,
                }}
              >
                Chủ đề không gian
              </Text>
              <TouchableOpacity
                style={{
                  height: 44,
                  backgroundColor: "#f8f8f8",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: "#E9D8FF",
                }}
                onPress={() => setThemeDropdownOpen(!themeDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "black",
                    fontFamily: "Baloo2_medium",
                    fontWeight: "500",
                  }}
                >
                  {themeOptions.find((opt) => opt.id === selectedTheme)?.label}
                </Text>
                <Text style={{ fontSize: 16, color: "black" }}>
                  {themeDropdownOpen ? (
                    <ChevronUp size={20} color="black" />
                  ) : (
                    <ChevronDown size={20} color="black" />
                  )}
                </Text>
              </TouchableOpacity>
              {themeDropdownOpen && (
                <View
                  style={{
                    backgroundColor: "#f8f8f8",
                    borderRadius: 12,
                    marginTop: 4,
                    borderWidth: 2,
                    borderColor: "#E9D8FF",
                    overflow: "hidden",
                    maxHeight: 180,
                  }}
                >
                  <ScrollView>
                    {themeOptions.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 16,
                          borderBottomWidth:
                            option.id !==
                            themeOptions[themeOptions.length - 1].id
                              ? 1
                              : 0,
                          borderBottomColor: "#E9D8FF",
                        }}
                        onPress={() => {
                          setSelectedTheme(option.id);
                          setThemeDropdownOpen(false);
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            color:
                              option.id === selectedTheme ? "#7c3aed" : "black",
                            fontFamily: "Baloo2_medium",
                            fontWeight:
                              option.id === selectedTheme ? "600" : "500",
                          }}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Color Selection */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: "Baloo2_medium",
                  fontWeight: "600",
                  fontSize: 16,
                  color: "black",
                  marginBottom: 8,
                }}
              >
                Màu cửa
              </Text>
              <View style={{ gap: 8 }}>
                {[0, 1].map((row) => (
                  <View
                    key={row}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: row === 0 ? 8 : 0,
                    }}
                  >
                    {colorOptions
                      .slice(row * 5, row * 5 + 5)
                      .map((colorOption) => (
                        <TouchableOpacity
                          key={colorOption.id}
                          style={[
                            {
                              width: 82,
                              height: 28,
                              backgroundColor: colorOption.color,
                              borderWidth:
                                selectedColor === colorOption.color ? 2 : 0,
                              borderColor: "#7c3aed",
                            },
                          ]}
                          onPress={() => setSelectedColor(colorOption.color)}
                        />
                      ))}
                  </View>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  backgroundColor: "white",
                  borderRadius: 24,
                  borderWidth: 2,
                  borderColor: "#d9d9d9",
                  minWidth: 80,
                  alignItems: "center",
                }}
                onPress={onClose}
              >
                <Text
                  style={{
                    fontFamily: "Baloo2_medium",
                    fontWeight: "500",
                    fontSize: 16,
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  backgroundColor: "#e8d7ff",
                  borderRadius: 24,
                  borderWidth: 2,
                  borderColor: "#e8d7ff",
                  minWidth: 80,
                  alignItems: "center",
                }}
                onPress={handleCreateRoom}
              >
                <Text
                  style={{
                    fontFamily: "Baloo2_medium",
                    fontWeight: "500",
                    fontSize: 16,
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  Tạo
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default RoomScreenModal;
