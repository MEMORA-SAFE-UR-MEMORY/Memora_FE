import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
  Image,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomSwitch from "./CustomSwitch";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SettingModal = ({ visible, onClose }: Props) => {
  const basicSettings = [
    {
      label: "Nhạc nền",
      isEnabled: false,
    },
    {
      label: "Tự động lưu thiết kế của bạn",
      isEnabled: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent={true}
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={["portrait", "landscape"]}
    >
      {/* Overlay */}
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Nội dung modal */}
        <View
          style={{
            width: "90%",
            backgroundColor: "white",
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            maxHeight: "90%",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "600",
                color: "black",
                fontFamily: "Baloo2_bold",
                textAlign: "center",
                flex: 1,
              }}
            >
              Cài đặt game
            </Text>
            <TouchableOpacity
              style={{
                width: 28,
                height: 28,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={onClose}
            >
              <Image
                source={require("../../assets/icons/Delete Icon.png")}
                style={{ width: 28, height: 28 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Chia 2 cột */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {/* Cột trái: Cài đặt cơ bản */}
            <View style={{ flex: 1, marginRight: 6 }}>
              <View
                style={{
                  backgroundColor: "#fff1f5",
                  borderRadius: 12,
                  paddingTop: 16,
                  paddingBottom: 4,
                  paddingHorizontal: 8,
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    fontFamily: "Baloo2_semiBold",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  Cài đặt cơ bản
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    marginTop: 6,
                    marginBottom: 10,
                  }}
                >
                  {basicSettings.map((setting, index) => (
                    <View
                      key={index}
                      style={{
                        width: "48%",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          fontFamily: "Baloo2_medium",
                          color: "black",
                          textAlign: "center",
                        }}
                      >
                        {setting.label}
                      </Text>
                      <CustomSwitch defaultValue={setting.isEnabled} />
                    </View>
                  ))}
                </View>

                {/* Chính sách bảo mật */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 10,
                    borderTopWidth: 0.5,
                    borderTopColor: "#e0e0e0",
                    marginTop: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Baloo2_medium",
                      color: "black",
                    }}
                  >
                    Chính sách bảo mật
                  </Text>
                  <ChevronRight size={18} color="black" />
                </TouchableOpacity>

                {/* Điều khoản sử dụng */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 10,
                    borderTopWidth: 0.5,
                    borderTopColor: "#e0e0e0",
                    marginTop: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Baloo2_medium",
                      color: "black",
                    }}
                  >
                    Điều khoản sử dụng
                  </Text>
                  <ChevronRight size={18} color="black" />
                </TouchableOpacity>

                {/* Phiên bản */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 10,
                    borderTopWidth: 0.5,
                    borderTopColor: "#e0e0e0",
                    marginTop: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Baloo2_medium",
                      color: "black",
                    }}
                  >
                    Phiên bản 1.0.0
                  </Text>
                  <ChevronRight size={18} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Cột phải: Đăng xuất + Cộng đồng */}
            <View style={{ flex: 1, marginLeft: 6 }}>
              {/* Đăng xuất */}
              <View
                style={{
                  backgroundColor: "#fff1f5",
                  borderRadius: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 8,
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    fontFamily: "Baloo2_semiBold",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  Đăng xuất
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#555252",
                    textAlign: "center",
                    fontFamily: "Baloo2_medium",
                  }}
                >
                  Bạn muốn đăng xuất tài khoản?{"\n"}(Di chuyển đến màn hình
                  tiêu đề khi đăng xuất)
                </Text>

                <View style={{ position: "relative", alignSelf: "center" }}>
                  <View
                    style={{
                      position: "absolute",
                      bottom: -5,
                      left: 0,
                      right: 0,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: "#4a6cff",
                    }}
                  />

                  {/* Nút chính */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#89d1fd",
                      borderRadius: 12,
                      paddingVertical: 6,
                      paddingHorizontal: 24,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        fontFamily: "Baloo2_medium",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      Đăng xuất
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Cộng đồng */}
              <View
                style={{
                  backgroundColor: "#fff1f5",
                  borderRadius: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    fontFamily: "Baloo2_semiBold",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  Cộng đồng chính thức
                </Text>

                {/* 3 icon mạng xã hội */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    justifyContent: "center",
                    marginTop: 4,
                  }}
                >
                  {/* Facebook */}
                  <TouchableOpacity
                    onPress={() => Linking.openURL("https://www.facebook.com/")}
                  >
                    <Image
                      source={require("../../assets/icons/facebook.png")}
                      style={{ width: 30, height: 30 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  {/* Instagram */}
                  <TouchableOpacity
                    onPress={() => Linking.openURL("https://instagram.com/")}
                  >
                    <Image
                      source={require("../../assets/icons/instagram.png")}
                      style={{ width: 30, height: 30 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  {/* TikTok */}
                  <TouchableOpacity
                    onPress={() => Linking.openURL("https://tiktok.com/")}
                  >
                    <Image
                      source={require("../../assets/icons/tiktok.png")}
                      style={{ width: 30, height: 30 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                {/* 2 nút dưới */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 16,
                    marginTop: 16,
                  }}
                >
                  {/* Hỗ trợ */}
                  <View style={{ flex: 1, position: "relative" }}>
                    <View
                      style={{
                        position: "absolute",
                        bottom: -5,
                        left: 0,
                        right: 0,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: "#B984F2",
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#D2A4FF",
                        borderRadius: 12,
                        paddingVertical: 6,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          fontFamily: "Baloo2_medium",
                          color: "white",
                        }}
                      >
                        Hỗ trợ
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Xóa tài khoản */}
                  <View style={{ flex: 1, position: "relative" }}>
                    <View
                      style={{
                        position: "absolute",
                        bottom: -5,
                        left: 0,
                        right: 0,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: "#B984F2",
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#D2A4FF",
                        borderRadius: 12,
                        paddingVertical: 6,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          fontFamily: "Baloo2_medium",
                          color: "white",
                        }}
                      >
                        Xóa tài khoản
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SettingModal;
