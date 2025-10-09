import CloneSuccessModal from "@src/components/album/CloneSuccessModal";
import DuplicateFabButton from "@src/components/album/DuplicateFabButton";
import PreviewRippleButton from "@src/components/album/PreviewRippleButton";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useCloneAlbum } from "services/album/hook";
import { Template } from "services/album/type";

type Dims = {
  cardW: number;
  cardH: number;
  leftW: number;
  leftH: number;
  rightW: number;
  a4Ratio: number;
};

type Props = {
  item: Template;
  dims: Dims;
  onPreview: () => void;
  onDuplicate: () => Promise<void>;
  cloning?: boolean;
};
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function AlbumTemplateCard({
  item,
  dims,
  onPreview,
  onDuplicate,
  cloning,
}: Props) {
  const { cardW, cardH, leftW, leftH, rightW, a4Ratio } = dims;

  const { clone, loading } = useCloneAlbum();
  const [showSuccess, setShowSuccess] = useState(false);
  const handleDuplicate = async () => {
    try {
      await clone(item.id);
      setShowSuccess(true);
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message ?? "Không thể tạo bản sao.");
    }
  };

  return (
    <Pressable
      style={[s.card, { width: cardW, height: cardH }]}
      onPress={() => {}}
    >
      {/* Left: A4 image */}
      <View
        style={[
          s.coverWrap,
          { width: leftW, height: leftH, aspectRatio: a4Ratio },
        ]}
      >
        {item.cover_url ? (
          <Image
            source={item.cover_url}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <View style={[s.coverFallback]}>
            <Text style={{ color: "#9aa0a6" }}>No cover</Text>
          </View>
        )}
      </View>

      {/* Right: info */}
      <View style={[s.infoPane, { width: rightW, height: leftH }]}>
        <Text style={s.title} numberOfLines={2}>
          {item.name}
        </Text>
        {!!item.description && (
          <Text style={s.desc} numberOfLines={6}>
            {item.description}
          </Text>
        )}
      </View>

      <PreviewRippleButton
        style={s.previewWrap}
        size={36}
        color="#ec4899"
        iconColor="#fff"
        onPress={onPreview}
      />

      {/* Nút tạo bản sao ở góc phải dưới */}
      <DuplicateFabButton
        loading={loading || !!cloning}
        onPress={handleDuplicate}
      />
      <CloneSuccessModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        onPrimary={() => {
          setShowSuccess(false);
          router.push("/my-albums" as any);
        }}
      />
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    padding: 0,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  coverWrap: { overflow: "hidden" },
  coverFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  infoPane: { justifyContent: "center", paddingHorizontal: 12, gap: 4 },
  title: {
    color: "#000",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Baloo2-medium",
  },
  desc: { color: "#797979ff", fontSize: 14, fontFamily: "Baloo2-medium" },
  previewWrap: { position: "absolute", right: 12, top: 12 },
});
