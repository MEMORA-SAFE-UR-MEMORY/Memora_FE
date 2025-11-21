import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  canClaim: boolean;
  timeLeft: string;
  onClose: () => void;
  onClaim: () => Promise<void>;
  claiming?: boolean;
  onCelebration?: (playing: boolean) => void;
  confettiDurationMs?: number;
};

export default function DailyRewardModal({
  visible,
  canClaim,
  timeLeft,
  onClose,
  onClaim,
  claiming,
  onCelebration,
  confettiDurationMs = 5000,
}: Props) {
  const [boom, setBoom] = useState(false);
  const [burstId, setBurstId] = useState(0);
  const { width, height } = useWindowDimensions();

  const handleClaim = async () => {
    await onClaim();
    onCelebration?.(true);
    setBurstId((id) => id + 1);
    setTimeout(() => setBoom(true), 16);
    setTimeout(() => {
      setBoom(false);
      onCelebration?.(false);
      onClose();
    }, confettiDurationMs);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
      hardwareAccelerated
      statusBarTranslucent
      presentationStyle="overFullScreen"
      supportedOrientations={["portrait", "landscape"]}
    >
      <View style={StyleSheet.absoluteFill}>
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0,0,0,0.6)" },
          ]}
        />
        <SafeAreaView
          edges={["left", "right", "bottom", "top"]}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              width: "86%",
              maxWidth: 380,
              backgroundColor: "white",
              borderRadius: 16,
              borderWidth: 6,
              borderColor: "#E9D8FF",
              paddingVertical: 16,
              paddingHorizontal: 14,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Baloo2_semiBold",
                color: "#111",
                marginBottom: 6,
              }}
            >
              Điểm danh hằng ngày
            </Text>

            {canClaim ? (
              <Text
                style={{
                  fontSize: 16,
                  color: "#333",
                  fontFamily: "Baloo2_medium",
                  marginBottom: 14,
                  textAlign: "center",
                }}
              >
                Chạm để nhận phần thưởng hôm nay!
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 15,
                  color: "#333",
                  marginBottom: 14,
                  fontFamily: "Baloo2_medium",
                  textAlign: "center",
                }}
              >
                Bạn đã nhận hôm nay rồi. Thời gian còn lại:{" "}
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Baloo2_semiBold",
                    color: "#f10303ff",
                  }}
                >
                  {timeLeft}
                </Text>
              </Text>
            )}

            <TouchableOpacity
              onPress={canClaim ? handleClaim : onClose}
              disabled={claiming}
              style={{
                minWidth: 180,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 28,
                borderWidth: 2,
                borderColor: canClaim ? "#B984F2" : "#d9d9d9",
                backgroundColor: canClaim ? "#E9D8FF" : "#f2f2f2",
                opacity: claiming ? 0.6 : 1,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "#111",
                  fontFamily: "Baloo2_semiBold",
                }}
              >
                {canClaim
                  ? claiming
                    ? "Đang nhận…"
                    : "Nhận ngay +100 puzzle"
                  : "Đã hiểu"}
              </Text>
            </TouchableOpacity>

            {canClaim && (
              <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
                <Text
                  style={{
                    color: "#817f7fff",
                    fontFamily: "Baloo2_medium",
                    fontSize: 16,
                  }}
                >
                  Để sau
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </View>

      {boom && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            elevation: 50,
          }}
        >
          <ConfettiCannon
            key={burstId}
            count={120}
            origin={{ x: width / 2, y: height + 40 }}
            fadeOut
            autoStart
            explosionSpeed={450}
            fallSpeed={Math.max(3200, confettiDurationMs)}
            colors={["#E74C3C", "#F1C40F", "#2ECC71", "#3498DB", "#9B59B6"]}
          />
        </View>
      )}
    </Modal>
  );
}
