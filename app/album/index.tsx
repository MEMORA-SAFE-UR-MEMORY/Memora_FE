import AlbumTemplateCard from "@src/components/album/AlbumTemplateCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { duplicateTemplate } from "services/album/api";
import { useAlbumTemplates } from "services/album/hook";

import { Template } from "services/album/type";

export default function AlbumScreen() {
  const router = useRouter();
  const { focusId } = useLocalSearchParams<{ focusId?: string }>();
  const { data, loading, error, reload } = useAlbumTemplates();
  const listRef = useRef<FlatList<Template>>(null);
  const [idx, setIdx] = useState(0);
  const [cloningId, setCloningId] = useState<number | null>(null);

  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    ).catch(() => {});
  }, []);

  const { width: winW, height: winH } = useWindowDimensions();
  const [navH, setNavH] = useState(72);

  const A4_RATIO = Math.SQRT2;
  const PADDING_TOP = 12;
  const SAFE_H = Math.max(160, winH - PADDING_TOP - navH - 8);

  const AVAIL_W = Math.min(winW * 0.84, 1200);
  const GAP = 16;
  const SCALE = 0.8;

  let RIGHT_W = Math.max(200, Math.min(300, AVAIL_W * 0.4));
  let LEFT_H = SAFE_H * SCALE;
  let LEFT_W = LEFT_H * A4_RATIO;

  // Nếu vượt bề ngang cho phép thì co khung A4 lại
  const MAX_LEFT_W = AVAIL_W - RIGHT_W - GAP;
  if (LEFT_W > MAX_LEFT_W) {
    LEFT_W = MAX_LEFT_W;
    LEFT_H = LEFT_W / A4_RATIO;
  }

  const CARD_W = LEFT_W + GAP + RIGHT_W;
  const CARD_H = LEFT_H;

  const goTo = (i: number) => {
    const clamp = Math.max(0, Math.min(i, (data?.length ?? 1) - 1));
    setIdx(clamp);
    try {
      listRef.current?.scrollToIndex({ index: clamp, animated: true });
    } catch {
      listRef.current?.scrollToOffset({ offset: winW * clamp, animated: true });
    }
  };

  useEffect(() => {
    try {
      listRef.current?.scrollToIndex({ index: idx, animated: false });
    } catch {
      listRef.current?.scrollToOffset({ offset: winW * idx, animated: false });
    }
  }, [winW, idx]);

  const didApplyFocus = useRef(false);
  useEffect(() => {
    if (didApplyFocus.current) return;
    if (!focusId || !data?.length) return;
    const i = data.findIndex((t) => String(t.id) === String(focusId));
    if (i >= 0) {
      didApplyFocus.current = true;
      setIdx(i);
      try {
        listRef.current?.scrollToIndex({ index: i, animated: false });
      } catch {
        listRef.current?.scrollToOffset({ offset: winW * i, animated: false });
      }
    }
  }, [focusId, data, winW]);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator />
        <Text style={s.muted}>Đang tải…</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={s.center}>
        <Text style={s.error}>{error}</Text>
        <Pressable style={s.btn} onPress={reload}>
          <Text style={s.btnText}>Thử lại</Text>
        </Pressable>
      </View>
    );
  }
  if (!data?.length) {
    return (
      <View style={s.center}>
        <Text style={s.muted}>Chưa có template.</Text>
      </View>
    );
  }

  return (
    <View style={s.page}>
      <FlatList
        ref={listRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(it) => String(it.id)}
        key={`carousel-${winW}`}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
        getItemLayout={(_, i) => ({
          length: winW,
          offset: winW * i,
          index: i,
        })}
        onMomentumScrollEnd={(e) =>
          setIdx(Math.round(e.nativeEvent.contentOffset.x / winW))
        }
        renderItem={({ item }) => (
          <View style={[s.slide, { width: winW }]}>
            <AlbumTemplateCard
              item={item}
              dims={{
                cardW: CARD_W,
                cardH: CARD_H,
                leftW: LEFT_W,
                leftH: LEFT_H,
                rightW: RIGHT_W,
                a4Ratio: A4_RATIO,
              }}
              onPreview={() =>
                router.replace({
                  pathname: "/album/preview/[id]" as any,
                  params: { id: String(item.id) },
                })
              }
              cloning={cloningId === item.id}
              onDuplicate={async () => {
                if (cloningId) return;
                try {
                  setCloningId(item.id);
                  await duplicateTemplate(item.id);
                } finally {
                  setCloningId(null);
                }
              }}
            />
          </View>
        )}
      />

      <View
        style={s.navRow}
        onLayout={(e) => setNavH(e.nativeEvent.layout.height)}
      >
        <Pressable
          onPress={() => goTo(idx - 1)}
          style={[s.navBtn, idx === 0 && s.navBtnDisabled]}
          disabled={idx === 0}
        >
          <Text style={s.navText}>‹ Trang trước</Text>
        </Pressable>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={s.pageIndicator}>
            {idx + 1} / {data.length}
          </Text>
        </View>

        <Pressable
          onPress={() => goTo(idx + 1)}
          style={[s.navBtn, idx === data.length - 1 && s.navBtnDisabled]}
          disabled={idx === data.length - 1}
        >
          <Text style={s.navText}>Trang sau ›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, paddingTop: 12 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0b0b0c",
  },
  muted: { color: "#9aa0a6" },
  error: { color: "#ff6b6b" },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#2a2e35",
  },
  btnText: { color: "#e6e8eb", fontWeight: "600" },

  slide: { alignItems: "center" },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 115,
  },
  navBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: "#212429",
  },
  navBtnDisabled: { opacity: 0.4 },
  navText: { color: "#e6e8eb", fontWeight: "600", fontFamily: "Baloo2-medium" },
  pageIndicator: {
    color: "#9aa0a6",
    fontSize: 14,
    fontFamily: "Baloo2-medium",
  },
});
