import AddDoorButton from "@src/components/inHome/AddDoorButton";
import DoorItem from "@src/components/inHome/DoorItem";
import { useScrollX } from "@src/context/ScrollXContext";
import React, { useEffect, useRef, useState } from "react";
import { Animated, useWindowDimensions, View } from "react-native";

type RoomItem = {
  id: number;
  room_name: string;
  door_id?: number;
  door?: { id?: number; img_url?: string | null; color_hex?: string | null };
};

type Props = {
  rooms: RoomItem[];
  roomsLoading: boolean;
  onDoorPress: (room: RoomItem) => void;
  onDoorLongPress: (room: RoomItem) => void;
  onAddDoorPress: () => void;
};

export default function DoorsScroller({
  rooms,
  roomsLoading,
  onDoorPress,
  onDoorLongPress,
  onAddDoorPress,
}: Props) {
  const { width, height } = useWindowDimensions();
  const { scrollX, setContentWidth, setHallReady } = useScrollX();

  // Chỉ đợi các cửa nằm trong viewport đầu tiên
  const shortest = Math.min(width, height);
  const baseScale = Math.min(1, shortest / 414);
  const extraShrink =
    shortest <= 320
      ? 0.75
      : shortest <= 360
        ? 0.82
        : shortest <= 375
          ? 0.88
          : 1;
  const largeShrink =
    shortest >= 768 ? 0.85 : shortest >= 520 ? 0.92 : shortest > 414 ? 0.95 : 1;
  const scale = baseScale * extraShrink * largeShrink;
  const doorWidth = Math.round(160 * scale);

  const GAP = 24;
  const PADDING = 26;
  const visiblePerScreen = Math.max(
    1,
    Math.floor((width - PADDING * 2 + GAP) / (doorWidth + GAP))
  );
  const visibleTarget = Math.min(rooms.length, visiblePerScreen + 1); // +1 mép

  const [contentSized, setContentSized] = useState(false);
  const [doorsLoaded, setDoorsLoaded] = useState(0);
  const loadedSetRef = useRef<Set<number>>(new Set());
  const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset khi data/viewport đổi
  useEffect(() => {
    loadedSetRef.current.clear();
    setDoorsLoaded(0);
    setContentSized(false);
    setHallReady(false);
    if (readyTimeoutRef.current) {
      clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = null;
    }
  }, [rooms.length, visibleTarget, width, height, setHallReady]);

  // Tắt loading khi: đo xong + đủ cửa đầu tiên đã load
  useEffect(() => {
    const allVisibleLoaded = doorsLoaded >= visibleTarget || rooms.length === 0;

    if (!roomsLoading && contentSized && allVisibleLoaded) {
      if (readyTimeoutRef.current) {
        clearTimeout(readyTimeoutRef.current);
        readyTimeoutRef.current = null;
      }
      requestAnimationFrame(() => setHallReady(true));
    } else {
      // Fallback tránh kẹt
      if (!roomsLoading && contentSized && !readyTimeoutRef.current) {
        readyTimeoutRef.current = setTimeout(() => setHallReady(true), 2500);
      }
    }
  }, [
    roomsLoading,
    contentSized,
    doorsLoaded,
    visibleTarget,
    rooms.length,
    setHallReady,
  ]);

  const handleDoorImageLoaded = (id: number) => {
    const s = loadedSetRef.current;
    if (!s.has(id)) {
      s.add(id);
      setDoorsLoaded((c) => c + 1);
    }
  };

  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      onContentSizeChange={(w) => {
        setContentWidth(w);
        setContentSized(true);
      }}
      scrollEventThrottle={16}
      contentContainerStyle={{
        gap: GAP,
        padding: PADDING,
        alignItems: "flex-end",
      }}
      style={{ zIndex: 1 }}
    >
      {rooms.map((room, index) => (
        <DoorItem
          key={room.id}
          door={{
            id: room.door?.id ?? room.door_id!,
            name: room.room_name,
            img_url: room.door?.img_url ?? undefined,
            color_hex: room.door?.color_hex ?? undefined,
          }}
          onPress={() => onDoorPress(room)}
          onLongPress={() => onDoorLongPress(room)}
          onImageLoaded={
            index < visibleTarget
              ? () => handleDoorImageLoaded(room.id)
              : undefined
          }
        />
      ))}

      <AddDoorButton onPress={onAddDoorPress} />
      <View style={{ width: PADDING }} />
    </Animated.ScrollView>
  );
}
