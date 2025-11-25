import { FontAwesome5 } from "@expo/vector-icons";
import ListRoomModal from "@src/components/ListRoomModal";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  back: string;
};

type Action = {
  id: number;
  name: string;
  iconName: string;
  size: number;
};

export default function ExploreIntroModal({
  visible,
  onClose,
  onConfirm,
  back,
}: Props) {
  // Mock
  const actions: Action[] = [
    {
      id: 1,
      name: "Danh sách",
      iconName: "list-ul",
      size: 20,
    },
    {
      id: 2,
      name: "Ngẫu nhiên",
      iconName: "random",
      size: 20,
    },
  ];

  // State
  const [selected, setSelected] = useState<number>(1);
  const [showList, setShowList] = useState<boolean>(false);

  // Check
  const isRandom = selected === 2;

  // Handle
  const handleDiscovery = () => {
    if (isRandom) {
      onConfirm();
    } else {
      setShowList(true);
    }
  };

  const handleCloseList = () => {
    setShowList(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={["portrait", "landscape"]}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 460,
            backgroundColor: "#FFF",
            borderRadius: 16,
            borderWidth: 2,
            borderColor: "#663530",
            padding: 18,
          }}
        >
          <Text
            style={{
              color: "#663530",
              fontFamily: "Baloo2_bold",
              fontSize: 20,
              textAlign: "center",
            }}
          >
            Ghé qua một nơi đang mở
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color: "#663530",
                fontFamily: "Baloo2_semiBold",
                fontSize: 16,
              }}
            >
              Chế độ:
            </Text>
            <View style={{ flexDirection: "row", gap: 20 }}>
              {actions.map((action) => {
                const isSelected = selected === action.id;
                return (
                  <TouchableOpacity
                    key={action.id}
                    style={[
                      {
                        padding: 10,
                        borderRadius: 50,
                        borderWidth: 1,
                        borderColor: "#663530",
                      },
                      isSelected && { backgroundColor: "#FFE6CC" },
                    ]}
                    onPress={() => setSelected(action.id)}
                  >
                    <FontAwesome5
                      name={action.iconName}
                      size={20}
                      color="#663530"
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {isRandom ? (
            <Text
              style={{
                color: "#5b3a36",
                fontFamily: "Baloo2_medium",
                fontSize: 16,
                textAlign: "center",
                lineHeight: 22,
                marginBottom: 20,
              }}
            >
              Tụi mình sẽ đưa bạn đến ngẫu nhiên một căn phòng đang được mở.
              {"\n"} Bạn chỉ việc ngồi xem thật nhẹ, như ghé qua một góc nhỏ ấm
              áp của ai đó. Khi muốn, bạn có thể rời đi bất kỳ lúc nào.
            </Text>
          ) : (
            <Text
              style={{
                color: "#5b3a36",
                fontFamily: "Baloo2_medium",
                fontSize: 16,
                textAlign: "center",
                lineHeight: 22,
                marginBottom: 20,
              }}
            >
              Bạn có thể ghé thăm bất kỳ phòng nào trong danh sách được mời tham
              quan.
              {"\n"} Chỉ cần chọn một căn phòng, bước vào và hòa mình vào câu
              chuyện mà họ muốn chia sẻ. Biết đâu, bạn lại tìm thấy cảm hứng mới
              cho chính không gian của mình.
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                height: 42,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#663530",
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#663530",
                  fontFamily: "Baloo2_bold",
                  fontSize: 16,
                }}
              >
                Để sau
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDiscovery}
              style={{
                flex: 1,
                height: 42,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#663530",
                backgroundColor: "#FFE6CC",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#663530",
                  fontFamily: "Baloo2_bold",
                  fontSize: 16,
                }}
              >
                Khám phá ngay
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showList && (
          <ListRoomModal
            visible={showList}
            onClose={handleCloseList}
            back={back}
          />
        )}
      </View>
    </Modal>
  );
}
