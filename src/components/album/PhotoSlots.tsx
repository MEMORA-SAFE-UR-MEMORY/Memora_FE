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

export type ShapeKind = "rect" | "rounded" | "circle" | "ellipse" | "diamond";

export type SlotSpec = {
  slot_index: number;
  x_pct: number;
  y_pct: number;
  w_pct: number;
  h_pct: number;
  rotation_deg?: number | null;
  z_index?: number | null;
  shape?: ShapeKind | null; // 'rect' | 'rounded' | 'circle' | 'ellipse' | 'diamond'
  corner_radius_pct?: number;
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

      const aspect = slot.w_pct / slot.h_pct;

      // chọn cặp aspect gần nhất cho Android (ImagePicker crop)
      const toPair = (r: number) => {
        const bases: [number, number][] = [
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
        let best = bases[0];
        let bestDiff = Infinity;
        for (const [w, h] of bases) {
          const diff = Math.abs(w / h - r);
          if (diff < bestDiff) {
            best = [w, h];
            bestDiff = diff;
          }
        }
        return best;
      };
      const [ax, ay] = toPair(aspect);

      const s = (slot.shape ?? "rect").toLowerCase() as ShapeKind;
      const oval = s === "circle" || s === "ellipse";

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], // an toàn cho tất cả phiên bản
        allowsEditing: true,
        aspect: [ax, ay], // Android: crop gần đúng tỉ lệ slot
        shape: oval && Platform.OS === "android" ? "oval" : undefined, // Android: crop tròn/bầu dục
        quality: 1,
      });

      if (res.canceled) return;
      const uri = res.assets?.[0]?.uri;
      if (!uri) return;

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
          const shape = (s.shape ?? "rect").toLowerCase() as ShapeKind;

          // border radius cho các shape cơ bản
          const borderRadius =
            shape === "circle" || shape === "ellipse"
              ? 9999
              : shape === "rounded"
                ? // bo theo % cạnh dài hơn
                  Math.max(s.w_pct, s.h_pct) *
                  (s.corner_radius_pct ?? 12) *
                  0.01
                : 0;

          // style chung (không diamond)
          const commonSlotStyle = {
            left: `${s.x_pct}%`,
            top: `${s.y_pct}%`,
            width: `${s.w_pct}%`,
            height: `${s.h_pct}%`,
            zIndex: s.z_index ?? 0,
            transform: [{ rotate }],
          } as const;

          // --- SHAPE: DIAMOND ---
          // Dùng 2 lớp: wrapper xoay 45°, inner xoay -45° để ảnh đứng thẳng
          if (shape === "diamond") {
            return (
              <View
                key={`slot-${s.slot_index}`}
                style={[
                  styles.diamondWrap,
                  commonSlotStyle,
                  {
                    transform: [{ rotate }, { rotateZ: "45deg" }],
                  },
                ]}
                pointerEvents="box-none"
              >
                <Pressable
                  onPress={() => handlePick(s)}
                  disabled={!pickable}
                  accessibilityRole={pickable ? "button" : undefined}
                  style={styles.diamondClip}
                >
                  {imgUri ? (
                    <Image
                      source={{ uri: imgUri }}
                      style={[
                        styles.img,
                        { transform: [{ rotateZ: "-45deg" }] },
                      ]}
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
              </View>
            );
          }

          // --- SHAPE: RECT / ROUNDED / CIRCLE / ELLIPSE ---
          return (
            <Pressable
              key={`slot-${s.slot_index}`}
              onPress={() => handlePick(s)}
              disabled={!pickable}
              accessibilityRole={pickable ? "button" : undefined}
              style={[styles.slot, commonSlotStyle, { borderRadius }]}
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

  // Diamond: wrapper xoay 45°, inner là hình vuông (overflow hidden)
  diamondWrap: {
    position: "absolute",
    overflow: "visible", // lớp clip ở con
  },
  diamondClip: {
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "#0077efff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
});
