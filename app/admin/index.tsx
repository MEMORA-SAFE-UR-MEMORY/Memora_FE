import PhotoSlots, {
  SlotImage,
  SlotSpec,
} from "@src/components/album/PhotoSlots";
import React, { useState } from "react";
import { View } from "react-native";

export default function AdminIndex() {
  const [slots] = useState<SlotSpec[]>([
    {
      slot_index: 1,
      x_pct: 29,
      y_pct: 16,
      w_pct: 15.5,
      h_pct: 52,
      rotation_deg: 0,
      z_index: 0,
      shape: "rect",
    },
    {
      slot_index: 2,
      x_pct: 48,
      y_pct: 17.8,
      w_pct: 24,
      h_pct: 31,
      rotation_deg: -1.8,
      z_index: 0,
      shape: "rect",
    },
  ]);

  const [images, setImages] = useState<SlotImage[]>([]);

  return (
    <View style={{ flex: 1 }}>
      <PhotoSlots
        slots={slots}
        images={images}
        onPick={(slotIndex, uri) => {
          setImages((prev) => {
            const next = prev.filter((p) => p.slot_index !== slotIndex);
            next.push({ slot_index: slotIndex, uri });
            return next;
          });
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
