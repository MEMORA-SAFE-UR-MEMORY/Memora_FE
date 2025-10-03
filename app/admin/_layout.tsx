// app/admin/_layout.tsx
import A4Overlay from "@src/components/admin/A4Overlay";
import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";

// 👉 đổi đường dẫn tới asset của bạn
export const ADMIN_BG = require("../../assets/templates/01.png");

export default function AdminLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0b0b0c" }}>
      {/* LAYER DƯỚI: Ảnh A4 landscape (nằm dưới làm nền/bìa) */}
      {/* <A4Overlay source={ADMIN_BG} mode="landscape" margin={12} /> */}

      {/* LAYER TRÊN: nội dung từng screen (PhotoSlots, v.v.) */}
      <Slot />
      <A4Overlay source={ADMIN_BG} mode="landscape" margin={12} />
    </View>
  );
}
