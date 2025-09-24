import { useMusic } from "@src/context/MusicContext";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import CustomSwitch from "./CustomSwitch";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SettingModal = ({ visible, onClose }: Props) => {
  const { isPlaying, toggleMusic } = useMusic();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isSmall = Math.min(width, height) <= 414;

  const basicSettings = [
    {
      label: "Nhạc nền",
      isEnabled: isPlaying,
      onToggle: toggleMusic,
    },
    {
      label: "Tự động lưu thiết kế của bạn",
      isEnabled: true,
      onToggle: () => {},
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
            width: isSmall ? "94%" : "90%",
            backgroundColor: "white",
            borderRadius: 16,
            paddingHorizontal: isSmall ? 12 : 16,
            paddingVertical: isSmall ? 10 : 12,
            maxHeight: "90%",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: isSmall ? 6 : 8,
            }}
          >
            <Text
              style={{
                fontSize: isSmall ? 20 : 24,
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

          <ScrollView
            contentContainerStyle={{
              paddingBottom: 12,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Chia cột: nhỏ => dọc, lớn => ngang */}
            <View
              style={{
                flexDirection: isSmall && !isLandscape ? "column" : "row",
                justifyContent: "space-between",
                gap: isSmall && !isLandscape ? 8 : 0,
              }}
            >
              {/* Cột trái: Cài đặt cơ bản */}
              <View
                style={{
                  flex: 1,
                  marginRight: isSmall && !isLandscape ? 0 : 6,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#ffd7e7",
                    overflow: "hidden",
                    marginTop: 8,
                  }}
                >
                  {/* Header màu hồng */}
                  <View
                    style={{
                      backgroundColor: "#fff1f5",
                      paddingVertical: isSmall ? 4 : 6,
                      paddingHorizontal: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: isSmall ? 16 : 18,
                        fontWeight: "600",
                        fontFamily: "Baloo2_semiBold",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      Cài đặt cơ bản
                    </Text>
                  </View>

                  {/* Body */}
                  <View
                    style={{
                      paddingTop: 8,
                      paddingHorizontal: 8,
                      paddingBottom: 6,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      {basicSettings.map((setting, index) => (
                        <View
                          key={index}
                          style={{
                            width: "48%",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: isSmall ? 13 : 14,
                              fontWeight: "500",
                              fontFamily: "Baloo2_medium",
                              color: "black",
                              textAlign: "center",
                              marginBottom: 6,
                            }}
                          >
                            {setting.label}
                          </Text>
                          <CustomSwitch
                            value={setting.isEnabled}
                            onToggle={setting.onToggle}
                          />
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
                      }}
                    >
                      <Text
                        style={{
                          fontSize: isSmall ? 13 : 14,
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
                      }}
                    >
                      <Text
                        style={{
                          fontSize: isSmall ? 13 : 14,
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
                      }}
                    >
                      <Text
                        style={{
                          fontSize: isSmall ? 13 : 14,
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
              </View>

              {/* Cột phải: Đăng xuất + Cộng đồng */}
              <View
                style={{
                  flex: 1,
                  marginLeft: isSmall && !isLandscape ? 0 : 6,
                }}
              >
                {/* Đăng xuất */}
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#ffd7e7",
                    overflow: "hidden",
                    marginTop: 8,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#fff1f5",
                      paddingVertical: isSmall ? 4 : 6,
                      paddingHorizontal: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: isSmall ? 16 : 18,
                        fontWeight: "600",
                        fontFamily: "Baloo2_semiBold",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      Đăng xuất
                    </Text>
                  </View>

                  <View style={{ padding: 10 }}>
                    <Text
                      style={{
                        fontSize: isSmall ? 13 : 14,
                        color: "#555252",
                        textAlign: "center",
                        fontFamily: "Baloo2_medium",
                        marginBottom: 2,
                      }}
                    >
                      Bạn muốn đăng xuất tài khoản?{"\n"}(Di chuyển đến màn hình
                      tiêu đề khi đăng xuất)
                    </Text>

                    <View style={{ position: "relative", alignSelf: "center" }}>
                      <View
                        style={{
                          position: "absolute",
                          bottom: isSmall ? -7 : -6,
                          left: 0,
                          right: 0,
                          height: isSmall ? 38 : 40,
                          borderRadius: 12,
                          backgroundColor: "#4a6cff",
                        }}
                      />
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
                            fontSize: isSmall ? 13 : 14,
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
                </View>

                {/* Cộng đồng */}
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#ffd7e7",
                    overflow: "hidden",
                    marginTop: 6,
                    paddingBottom: 6,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#fff1f5",
                      paddingVertical: isSmall ? 4 : 6,
                      paddingHorizontal: 24,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: isSmall ? 15 : 16,
                        fontWeight: "600",
                        fontFamily: "Baloo2_semiBold",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      Cộng đồng chính thức
                    </Text>
                  </View>

                  <View style={{ paddingVertical: 8, paddingHorizontal: 16 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        justifyContent: "center",
                      }}
                    >
                      {/* Facebook */}
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            "https://www.facebook.com/auraOfMemory/"
                          )
                        }
                      >
                        <Image
                          source={require("../../assets/icons/facebook.png")}
                          style={{ width: 30, height: 30 }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>

                      {/* Instagram */}
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            "https://www.instagram.com/memora__official/"
                          )
                        }
                      >
                        <Image
                          source={require("../../assets/icons/instagram.png")}
                          style={{ width: 30, height: 30 }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>

                      {/* TikTok */}
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            "https://www.tiktok.com/@memora__official"
                          )
                        }
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
                        marginTop: 12,
                      }}
                    >
                      {/* Hỗ trợ */}
                      <View style={{ flex: 1, position: "relative" }}>
                        <View
                          style={{
                            position: "absolute",
                            bottom: isSmall ? -7 : -6,
                            left: 0,
                            right: 0,
                            height: isSmall ? 38 : 40,
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
                              fontSize: isSmall ? 13 : 14,
                              fontWeight: "600",
                              fontFamily: "Baloo2_medium",
                              color: "white",
                            }}
                          >
                            Hỗ trợ
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SettingModal;
