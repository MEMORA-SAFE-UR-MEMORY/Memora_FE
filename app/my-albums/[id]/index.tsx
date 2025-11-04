import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { uploadSlotPhotoViaApi } from "services/album/api";
import { useAlbumPages } from "services/album/hook";

export default function EditAlbumScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const albumId = Number(id);
  const { width: winW, height: winH } = useWindowDimensions();
  const MAX_W = Math.min(800, winW * 0.6) - 32;
  const MAX_H = winH - 160;

  const {
    data: pages,
    loading,
    refreshSlot,
    isOrdered,
  } = useAlbumPages(albumId); // added isOrdered
  const [idx, setIdx] = useState(0);
  const [uploadingSlotId, setUploadingSlotId] = useState<number | null>(null);
  const current = pages[idx];

  useEffect(() => {
    setIdx((i) => (pages.length ? Math.min(i, pages.length - 1) : 0));
  }, [pages.length]);

  const go = (delta: number) => {
    if (!pages.length) return;
    setIdx((i) => (i + delta + pages.length) % pages.length);
  };

  const pickAndUpload = async (
    slotId: number,
    pageId: number,
    slotIndex: number
  ) => {
    if (isOrdered) {
      Alert.alert("Album đã đặt", "Bạn không thể thay đổi ảnh nữa.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
    });
    if (res.canceled) return;
    const asset = res.assets[0];
    const uri = asset.uri;
    try {
      setUploadingSlotId(slotId);

      const ext = (asset.fileName?.split(".").pop() || "jpg").toLowerCase();
      const contentType =
        asset.mimeType ||
        (ext === "png"
          ? "image/png"
          : ext === "webp"
            ? "image/webp"
            : ext === "heic"
              ? "image/heic"
              : "image/jpeg");

      const fileName = asset.fileName || `slot_${slotIndex}.${ext}`;
      await uploadSlotPhotoViaApi({
        slotId,
        file: { uri, name: fileName, type: contentType },
      });

      await refreshSlot(slotId);
      Alert.alert("Đã cập nhật ảnh", "Ảnh đã được lưu cho slot này.");
    } catch (e: any) {
      Alert.alert("Lỗi upload", e?.message ?? "Không thể upload ảnh.");
    } finally {
      setUploadingSlotId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text className="fontFamily: 'Baloo2-medium'">Đang tải…</Text>
      </View>
    );
  }

  if (!pages.length) {
    return (
      <View style={styles.center}>
        <Text className="fontFamily: 'Baloo2-medium'">
          Album chưa có trang.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {/* LEFT: Preview page */}
      <View
        style={[
          styles.left,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        {current?.layout_snapshot_url ? (
          <Image
            source={{ uri: current.layout_snapshot_url }}
            resizeMode="contain"
            style={{
              width: MAX_W,
              height: MAX_H,
              borderRadius: 16,
              overflow: "hidden",
            }}
          />
        ) : (
          <View style={[styles.center, { width: MAX_W, height: MAX_H }]}>
            <Text className="fontFamily: 'Baloo2-medium'">
              Trang không có ảnh nền.
            </Text>
          </View>
        )}

        <Pressable style={[styles.navBtn, { left: 40 }]} onPress={() => go(-1)}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Pressable style={[styles.navBtn, { right: 40 }]} onPress={() => go(1)}>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </Pressable>

        <View style={styles.indicator}>
          <Text style={styles.indTxt}>
            {idx + 1}/{pages.length}
          </Text>
        </View>
      </View>

      {/* RIGHT: Slots uploader */}
      <View style={styles.right}>
        {isOrdered && (
          <View style={styles.lockBanner}>
            <Ionicons name="lock-closed" size={16} color="#6b7280" />
            <Text style={styles.lockBannerTxt}>
              Album đã đặt • Khóa chỉnh sửa
            </Text>
          </View>
        )}
        <Text style={styles.rightTitle}>Ảnh cho trang {current.page_no}</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          {current.slots.map((s) => {
            const disabled = isOrdered || uploadingSlotId === s.id;
            return (
              <View key={s.id} style={styles.slotRow}>
                <Text style={styles.slotLabel}>Slot {s.slot_index}</Text>
                <View style={styles.slotThumbBox}>
                  {s.photo_url ? (
                    <Image
                      source={{ uri: s.photo_url }}
                      style={styles.slotImage}
                    />
                  ) : (
                    <View style={[styles.slotImage, styles.slotEmpty]}>
                      <Ionicons
                        name="image-outline"
                        size={26}
                        color="#9ca3af"
                      />
                    </View>
                  )}
                  {(uploadingSlotId === s.id || isOrdered) && (
                    <View style={styles.slotOverlay}>
                      {isOrdered ? (
                        <Ionicons name="lock-closed" size={20} color="#fff" />
                      ) : (
                        <ActivityIndicator color="#fff" />
                      )}
                    </View>
                  )}
                </View>
                <Pressable
                  disabled={disabled}
                  onPress={() => pickAndUpload(s.id, current.id, s.slot_index)}
                  style={[
                    styles.uploadBtn,
                    disabled && { opacity: 0.55, backgroundColor: "#9CA3AF" },
                  ]}
                >
                  <Ionicons
                    name={
                      s.photo_url ? "refresh-outline" : "cloud-upload-outline"
                    }
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.uploadTxt}>
                    {isOrdered
                      ? "Đã khóa"
                      : s.photo_url
                        ? "Thay ảnh"
                        : "Tải ảnh"}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  left: { flex: 1, backgroundColor: "" },
  right: {
    width: 360,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: "#e5e7eb",
    padding: 12,
    backgroundColor: "#fff",
  },
  rightTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontFamily: "Baloo2_medium",
    textAlign: "center",
  },
  navBtn: {
    position: "absolute",
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    bottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  indTxt: { color: "#fff", fontFamily: "Baloo2_medium" },
  slotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  slotLabel: {
    width: 70,
    color: "#374151",
    fontFamily: "Baloo2_medium",
    fontSize: 16,
  },
  slotThumbBox: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
    position: "relative",
  },
  slotImage: { width: "100%", height: "100%" },
  slotEmpty: { alignItems: "center", justifyContent: "center" },
  slotOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadBtn: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#7c3aed",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 8,
  },
  uploadTxt: { color: "#fff", fontFamily: "Baloo2_medium" },
  lockBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  lockBannerTxt: {
    color: "#374151",
    fontSize: 14,
    fontFamily: "Baloo2_medium",
  },
});
