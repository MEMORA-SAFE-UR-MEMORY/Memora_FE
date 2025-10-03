import { Stack } from "expo-router";
import React from "react";

export default function PreviewLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "transparentModal",
        contentStyle: { backgroundColor: "transparent" },
        animation: "fade",
      }}
    />
  );
}
