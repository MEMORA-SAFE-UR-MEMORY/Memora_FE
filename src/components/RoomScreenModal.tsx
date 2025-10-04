import { useDoorImagePrefetch } from "@src/hooks/useDoorImagePrefetch";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
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
import { useDoors } from "../../services/rooms/hook";
import { Door } from "../../services/rooms/type";
import { useUserThemes } from "services/userThemes/hook";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (
    roomName: string,
    themeId: number | null,
    doorId: number | null
  ) => void;
};

type ThemeOption =
  | { id: "default"; label: string; door_id: null }
  | { id: number; label: string; door_id: number | null };

const RoomScreenModal = ({ visible, onClose, onConfirm }: Props) => {
  const { doors, loading: loadingDoors } = useDoors();
  const { items: userThemes, loading: loadingThemes } = useUserThemes();
  const DEFAULT_THEME_NAME = "Mặc định";

  const [selectedDoorId, setSelectedDoorId] = useState<number | null>(null);
  const [roomName, setRoomName] = useState<string>("");
  const [selectedThemeId, setSelectedThemeId] = useState<"default" | number>(
    "default"
  );
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const defaultThemeIdFromDb = useMemo(() => {
    const match = (userThemes ?? []).find(
      (ut) =>
        (ut.theme?.theme_name ?? "").trim().toLowerCase() ===
        DEFAULT_THEME_NAME.toLowerCase()
    );
    // Use user_themes.id to store in rooms.theme_id
    return match?.id ?? null;
  }, [userThemes]);

  const themeOptions: ThemeOption[] = useMemo(() => {
    const owned = (userThemes ?? [])
      // bỏ theme "Mặc định" từ DB để tránh trùng với option giả lập
      .filter(
        (ut) =>
          (ut.theme?.theme_name ?? "").trim().toLowerCase() !==
          DEFAULT_THEME_NAME.toLowerCase()
      )
      .map((ut) => ({
        // IMPORTANT: option id is user_themes.id (not themes.id)
        id: ut.id,
        label: ut.theme?.theme_name ?? `Theme #${ut.theme_id}`,
        door_id: ut.theme?.door_id ?? null,
      }));
    return [{ id: "default", label: "Mặc định", door_id: null }, ...owned];
  }, [userThemes]);
  useDoorImagePrefetch(doors, selectedDoorId, themeDropdownOpen, themeOptions);

  useEffect(() => {
    if (!visible) {
      setRoomName("");
      setSelectedThemeId("default");
      setThemeDropdownOpen(false);
      setSelectedDoorId(null);
    }
  }, [visible]);

  useEffect(() => {
    const picked = themeOptions.find((t) => t.id === selectedThemeId);
    if (picked && picked.door_id) {
      setSelectedDoorId(picked.door_id);
    } else if (selectedThemeId === "default") {
      setSelectedDoorId(null);
    }
  }, [selectedThemeId, themeOptions]);

  const themeHasDoor = useMemo(() => {
    const picked = themeOptions.find((t) => t.id === selectedThemeId);
    return !!picked?.door_id;
  }, [selectedThemeId, themeOptions]);

  const handleCreateRoom = () => {
    const themeId: number | null =
      selectedThemeId === "default"
        ? defaultThemeIdFromDb
        : Number(selectedThemeId);

    if (selectedThemeId === "default" && !themeId) {
      console.warn("[CreateRoom] Không tìm thấy id theme 'Mặc định' trong DB");
      return;
    }
    const roomDoorIdToSave: number | null = selectedDoorId;

    try {
      console.log(
        "[CreateRoom] selectedThemeId:",
        selectedThemeId,
        "-> themeId:",
        themeId,
        "defaultThemeIdFromDb:",
        defaultThemeIdFromDb
      );
      console.log(
        "[CreateRoom] selectedDoorId:",
        selectedDoorId,
        "roomDoorIdToSave:",
        roomDoorIdToSave,
        "roomName:",
        roomName
      );
    } catch {}

    if (!roomName) return;
    if (!selectedDoorId) return;

    onConfirm(roomName, themeId, roomDoorIdToSave);
  };

  const renderDoorSwatch = (door: Door) => {
    const active = selectedDoorId === door.id;
    return (
      <TouchableOpacity
        key={door.id}
        onPress={() => setSelectedDoorId(door.id)}
        activeOpacity={0.9}
        style={{
          width: 82,
          height: 28,
          borderRadius: 4,
          backgroundColor: door.color_hex ?? "#cccccc",
          borderWidth: active ? 2 : 0,
          borderColor: "#7c3aed",
          marginBottom: 8,
        }}
      />
    );
  };

  const themeLabel =
    themeOptions.find((opt) => opt.id === selectedThemeId)?.label ??
    "Chọn chủ đề";

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
                  fontFamily: "Baloo2_bold",
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
                  fontFamily: "Baloo2_semiBold",
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
                placeholder="Ví dụ: Ký ức tuổi thơ"
                placeholderTextColor="#666"
              />
            </View>

            {/* Theme Selection */}
            <View style={{ marginBottom: 6 }}>
              <Text
                style={{
                  fontFamily: "Baloo2_semiBold",
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
                disabled={loadingThemes}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "black",
                    fontFamily: "Baloo2_medium",
                    fontWeight: "500",
                  }}
                >
                  {loadingThemes ? "Đang tải..." : themeLabel}
                </Text>
                <Text style={{ fontSize: 16, color: "black" }}>
                  {themeDropdownOpen ? (
                    <ChevronUp size={20} color="black" />
                  ) : (
                    <ChevronDown size={20} color="black" />
                  )}
                </Text>
              </TouchableOpacity>

              {themeDropdownOpen && !loadingThemes && (
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
                        key={`${option.id}`}
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
                          setSelectedThemeId(option.id);
                          setThemeDropdownOpen(false);
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            color:
                              option.id === selectedThemeId
                                ? "#7c3aed"
                                : "black",
                            fontFamily: "Baloo2_medium",
                            fontWeight:
                              option.id === selectedThemeId ? "600" : "500",
                          }}
                        >
                          {option.label}
                        </Text>
                        {option.door_id ? (
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#7c3aed",
                              marginTop: 2,
                              fontFamily: "Baloo2_medium",
                            }}
                          >
                            * Chủ đề này đi kèm cửa riêng
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Color Selection */}
            {!themeHasDoor && (
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontFamily: "Baloo2_semiBold",
                    fontWeight: "600",
                    fontSize: 16,
                    color: "black",
                    marginBottom: 10,
                  }}
                >
                  Màu cửa
                </Text>
                {loadingDoors ? (
                  <Text>Đang tải danh sách cửa…</Text>
                ) : (
                  <View style={{ gap: 2 }}>
                    {[0, 1].map((row) => (
                      <View
                        key={row}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: row === 0 ? 8 : 0,
                        }}
                      >
                        {doors
                          .slice(row * 5, row * 5 + 5)
                          .map((door) => renderDoorSwatch(door))}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

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

                  opacity: !roomName || !selectedDoorId ? 0.6 : 1,
                }}
                disabled={!roomName || !selectedDoorId}
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
