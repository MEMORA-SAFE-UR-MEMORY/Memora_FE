import * as ImagePicker from "expo-image-picker";
import React, { useMemo } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

export type SlotSpec = {
  slot_index: number;
  x_pct: number;
  y_pct: number;
  w_pct: number;
  h_pct: number;
  rotation_deg?: number | null;
  z_index?: number | null;
  shape?: string | null; // 'rect' | 'circle'
};

export type SlotImage = {
  slot_index: number;
  uri?: string | null;
};

type Props = {
  slots: SlotSpec[];
  images?: SlotImage[];
  onPick?: (slotIndex: number, uri: string) => void;
  pickable?: boolean;
  style?: ViewStyle;
};

export default function PhotoSlots({
  slots,
  images = [],
  onPick,
  pickable = true,
  style,
}: Props) {
  const imgByIndex = useMemo(() => {
    const m = new Map<number, string>();
    images.forEach((i) => {
      if (i.uri) m.set(i.slot_index, i.uri);
    });
    return m;
  }, [images]);

  const [mediaPerm, requestMediaPerm, getMediaPerm] =
    ImagePicker.useMediaLibraryPermissions();

  const ensureMediaPermission = async () => {
    const status = mediaPerm ?? (await getMediaPerm());
    if (!status?.granted) {
      const asked = await requestMediaPerm();
      if (!asked.granted) {
        Alert.alert("Cần quyền", "Vui lòng cấp quyền truy cập thư viện ảnh.");
        return false;
      }
    }
    return true;
  };

  const handlePick = async (slot: SlotSpec) => {
    try {
      if (!pickable) return;
      const ok = await ensureMediaPermission();
      if (!ok) return;

      const aspect = slot.w_pct / slot.h_pct; // tỉ lệ theo slot
      // Tính [x, y] nguyên cho tham số aspect Android
      // ví dụ 1.333 -> [4,3]; 0.75 -> [3,4]
      const toPair = (r: number) => {
        const eps = 1e-3;
        const bases = [
          [1, 1],
          [4, 3],
          [3, 4],
          [16, 9],
          [9, 16],
          [5, 4],
          [4, 5],
          [3, 2],
          [2, 3],
        ];
        // pick cặp gần nhất
        let best = [1, 1];
        let bestDiff = Infinity;
        for (const [w, h] of bases) {
          const diff = Math.abs(w / h - r);
          if (diff < bestDiff - eps) {
            best = [w, h];
            bestDiff = diff;
          }
        }
        return best as [number, number];
      };
      const [ax, ay] = toPair(aspect);

      const isCircle =
        (slot.shape ?? "rect").toLowerCase() === "circle" ? true : false;

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true, // dùng UI crop/zoom của hệ thống
        // Android: dùng aspect + shape
        aspect: [ax, ay], // chỉ có hiệu lực trên Android
        shape: isCircle && Platform.OS === "android" ? "oval" : undefined,
        quality: 1, // giữ chất lượng, tránh nén thêm
      });

      if (res.canceled) return;
      const uri = res.assets?.[0]?.uri;
      if (!uri) return;

      // iOS: crop luôn là vuông (Apple). Nếu slot không vuông, ảnh sẽ lệch tỉ lệ.
      // Bạn chấp nhận điều này để có UX đơn giản như yêu cầu.

      onPick?.(slot.slot_index, uri);
    } catch (e) {
      console.warn(e);
      Alert.alert("Lỗi", "Không thể chọn/cắt ảnh.");
    }
  };

  return (
    <View style={[styles.wrap, style]}>
      {slots
        .slice()
        .sort((a, b) => (a.z_index ?? 0) - (b.z_index ?? 0))
        .map((s) => {
          const imgUri = imgByIndex.get(s.slot_index);
          const rotate = `${s.rotation_deg ?? 0}deg`;
          const borderRadius =
            (s.shape ?? "rect").toLowerCase() === "circle" ? 9999 : 8;

          return (
            <Pressable
              key={s.slot_index}
              onPress={() => handlePick(s)}
              disabled={!pickable}
              accessibilityRole={pickable ? "button" : undefined}
              style={[
                styles.slot,
                {
                  left: `${s.x_pct}%`,
                  top: `${s.y_pct}%`,
                  width: `${s.w_pct}%`,
                  height: `${s.h_pct}%`,
                  zIndex: s.z_index ?? 0,
                  transform: [{ rotate }],
                  borderRadius,
                },
              ]}
            >
              {imgUri ? (
                <Image
                  source={{ uri: imgUri }}
                  style={styles.img}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.phText}>Slot {s.slot_index}</Text>
                  {pickable && (
                    <Text style={styles.hint}>Chạm để chọn & cắt ảnh</Text>
                  )}
                </View>
              )}
            </Pressable>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "relative", overflow: "hidden" },
  slot: {
    position: "absolute",
    backgroundColor: "#0077efff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  img: { width: "100%", height: "100%" },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  phText: { color: "#cbd5e1", fontWeight: "600" },
  hint: { color: "#94a3b8", fontSize: 12 },
});
