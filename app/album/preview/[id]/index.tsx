import { Ionicons } from "@expo/vector-icons";
import { toCdnImageUrl } from "@src/utils/cdn";
import { Image as ExpoImage } from "expo-image";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  PixelRatio,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { fetchAllPagesOfTemplate } from "services/album/api";
import { TemplatePage } from "services/album/type";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function TemplatePreviewOverlay() {
  const router = useRouter();
  const navigation: any = useNavigation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const templateId = Number(id);
  const lastFetchedId = useRef<number | null>(null);
  console.log("[Preview] templateId:", templateId);

  const [pages, setPages] = useState<TemplatePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [attempt, setAttempt] = useState(0);

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
        console.log("[Preview] fetching pages for template:", templateId);
        const res = await fetchAllPagesOfTemplate(templateId);
        if (!ignore) {
          console.log("[Preview] fetched pages count:", res?.length ?? 0);
          if (res?.length)
            console.log("[Preview] first 2 pages sample:", res.slice(0, 2));
          setPages(res);
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
    // Mỗi lần đổi trang reset lại thử CDN trước
    setAttempt(0);
  }, [idx, current?.id]);

  const srcList = (() => {
    if (!current?.layout_url) return [];
    const scale = PixelRatio.get();
    const w = Math.round(MAX_W * scale);
    const h = Math.round(MAX_H * scale);
    const cdn = toCdnImageUrl(current.layout_url, {
      w,
      h,
      q: 75,
      format: "webp",
    });
    return [cdn, current.layout_url];
  })();

  const go = (delta: number) => {
    if (!pages.length) return;
    setIdx((i) => (i + delta + pages.length) % pages.length);
  };

  const closeOverlay = () => {
    try {
      if (navigation?.canGoBack?.()) {
        navigation.goBack();
        return;
      }
    } catch {}
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
            <ExpoImage
              source={srcList[attempt] ? { uri: srcList[attempt] } : undefined}
              placeholder={{ blurhash }}
              contentFit="contain"
              transition={160}
              cachePolicy="memory-disk"
              recyclingKey={String(current?.id)}
              priority="high"
              onError={() => {
                // Fallback sang URL gốc nếu CDN timeout
                setAttempt((a) => (a < srcList.length - 1 ? a + 1 : a));
              }}
              style={[styles.pageImage, { width: MAX_W, height: MAX_H }]}
            />
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
