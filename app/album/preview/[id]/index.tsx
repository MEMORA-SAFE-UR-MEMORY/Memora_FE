import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { fetchAllPagesOfTemplate } from "services/album/api";
import { TemplatePage } from "services/album/type";

export default function TemplatePreviewOverlay() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const templateId = Number(id);
  const lastFetchedId = useRef<number | null>(null);

  const [pages, setPages] = useState<TemplatePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);

  const { width: winW, height: winH } = useWindowDimensions();
  const MAX_W = winW - 120;
  const MAX_H = winH - 120;

  useEffect(() => {
    let ignore = false;
    if (!templateId || Number.isNaN(templateId)) return;
    if (lastFetchedId.current === templateId) return;
    lastFetchedId.current = templateId;

    (async () => {
      setLoading(true);
      try {
        const res = await fetchAllPagesOfTemplate(templateId);
        if (!ignore) {
          if (res?.length) setPages(res);
          const start = res.findIndex((p) => !!p.layout_url);
          setIdx(start >= 0 ? start : 0);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [templateId]);

  const current = pages[idx];

  useEffect(() => {
    if (!pages.length) return;
    const urls = pages.map((p) => p.layout_url).filter(Boolean) as string[];
    urls.forEach((u) => Image.prefetch(u).catch(() => {}));
  }, [pages]);

  const go = (delta: number) => {
    if (!pages.length) return;
    setIdx((i) => (i + delta + pages.length) % pages.length);
  };

  const closeOverlay = () => {
    router.replace({
      pathname: "/album",
      params: { focusId: String(templateId) },
    });
  };

  return (
    <View style={styles.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={closeOverlay} />

      <View style={styles.centerBox}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.muted}>Đang tải…</Text>
          </View>
        ) : pages.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.muted}>Không có trang.</Text>
          </View>
        ) : (
          <>
            {current?.layout_url ? (
              <Image
                source={{ uri: current.layout_url }}
                resizeMode="contain"
                onLoad={() => {}}
                onError={() => {}}
                style={[
                  styles.pageImage,
                  {
                    width: MAX_W,
                    height: MAX_H,
                  },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.center,
                  {
                    width: MAX_W,
                    height: MAX_H,
                  },
                ]}
              >
                <Text style={styles.muted}>Trang này không có ảnh.</Text>
              </View>
            )}
            {/* Prev */}
            <Pressable
              style={[styles.navBtn, { left: 24 }]}
              onPress={() => go(-1)}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </Pressable>

            {/* Next */}
            <Pressable
              style={[styles.navBtn, { right: 24 }]}
              onPress={() => go(1)}
            >
              <Ionicons name="chevron-forward" size={28} color="#fff" />
            </Pressable>

            {/* Close */}
            <Pressable style={styles.closeBtn} onPress={closeOverlay}>
              <Ionicons name="close" size={22} color="#fff" />
            </Pressable>

            {/* Indicator */}
            <View style={styles.indicator}>
              <Text style={styles.indTxt}>
                {idx + 1}/{pages.length}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  centerBox: { alignItems: "center", justifyContent: "center" },
  center: { alignItems: "center", justifyContent: "center", gap: 8 },
  muted: { color: "#cbd5e1" },
  pageImage: {
    borderRadius: 16,
    overflow: "hidden",
  },
  navBtn: {
    position: "absolute",
    top: "50%",
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 0,
    right: 26,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    bottom: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  indTxt: { color: "#fff", fontWeight: "600", fontFamily: "Baloo2-medium" },
});
