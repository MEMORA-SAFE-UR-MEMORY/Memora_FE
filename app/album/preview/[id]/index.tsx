import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

  // Log chỉ khi đã có trang hiện tại
  useEffect(() => {
    if (!current) return;
    console.log(
      "[Preview] current page idx/id/role/layout_url:",
      idx,
      current.id,
      current.role,
      current.layout_url
    );
  }, [idx, current]);

  useEffect(() => {
    if (!pages.length) return;
    const urls = pages.map((p) => p.layout_url).filter(Boolean) as string[];
    urls.forEach((u) => ExpoImage.prefetch(u).catch(() => {}));
  }, [pages]);

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
              source={current?.layout_url || undefined}
              placeholder={{ blurhash }}
              contentFit="contain"
              transition={200}
              cachePolicy="memory-disk"
              recyclingKey={String(current?.id)}
              priority="high"
              onLoad={() => console.log("[Preview] image loaded:", current?.id)}
              onError={(e) => {
                try {
                  const msg = (e?.error as string) || JSON.stringify(e);
                  console.log("[Preview] image error:", msg);
                } catch (err) {
                  console.log("[Preview] image error (unknown)", err);
                }
              }}
              style={[
                styles.pageImage,
                {
                  width: MAX_W,
                  height: MAX_H,
                },
              ]}
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
