import { useRoomDraftContext } from "@src/context/DraftContext";
import { memoryService } from "@src/services/memoryService";
import { RoomItem } from "@src/types/item";
import { Memory } from "@src/types/memory";
import { generateTempId } from "@src/utils/idGenerator";
import { useCallback, useEffect, useState } from "react";

type UseRoomDecorationParams = {
  roomId: number;
  baseItems?: RoomItem[];
  decreaseQuantity: (itemId: number) => void;
  increaseQuantity: (itemId: number) => void;
};

export const useRoomDecoration = ({
  roomId,
  baseItems = [],
  decreaseQuantity,
  increaseQuantity,
}: UseRoomDecorationParams) => {
  const [placedItems, setPlacedItems] = useState<RoomItem[]>([]);
  const [placedItemMemories, setPlacedItemMemories] = useState<
    Record<number, Record<number, Memory>>
  >({});

  const { savePatch } = useRoomDraftContext();

  const MAX_DECOR = 10;
  const MAX_FRAME = 15;
  const [decorCount, setDecorCount] = useState(0);
  const [frameCount, setFrameCount] = useState(0);

  useEffect(() => {
    if (baseItems.length > 0) {
      setPlacedItems(baseItems);
      setDecorCount(baseItems.filter((i) => i.item.categoryId === 2).length);
      setFrameCount(baseItems.filter((i) => i.item.categoryId === 1).length);
    } else {
      setDecorCount(0);
      setFrameCount(0);
    }
  }, [baseItems]);

  const normalizeZIndex = (items: RoomItem[]): RoomItem[] => {
    return [...items]
      .sort((a, b) => a.zIndex - b.zIndex)
      .map((item, index) => ({
        ...item,
        zIndex: index + 1,
      }));
  };

  const persistUpsert = (item: RoomItem) => {
    savePatch({
      op: "upsertItem",
      itemId: item.id,
      refItemId: item.item.id,
      x: item.x,
      y: item.y,
      zIndex: item.zIndex,
      rotation: item.rotation ?? 0,
    });
  };

  // Thêm item vào phòng
  const placeItem = useCallback(
    (newItem: Omit<RoomItem, "id">): RoomItem => {
      const roomItemId = generateTempId();
      // compute zIndex based on current placedItems length (use functional update to be safe)
      let createdRoomItem: RoomItem = {
        id: roomItemId,
        x: newItem.x,
        y: newItem.y,
        rotation: newItem.rotation,
        zIndex: 0, // will set in updater
        item: newItem.item,
        slotMemories: newItem.slotMemories ?? {},
      };

      setPlacedItems((prev) => {
        const normalized = normalizeZIndex(prev);
        const zIndex = normalized.length + 1;
        createdRoomItem = { ...createdRoomItem, zIndex };
        // persist patch now we know zIndex
        persistUpsert(createdRoomItem);
        return [...normalized, createdRoomItem];
      });

      if (newItem.item.categoryId === 2) setDecorCount((c) => c + 1);
      if (newItem.item.categoryId === 1) setFrameCount((c) => c + 1);

      decreaseQuantity(newItem.item.id);
      return createdRoomItem;
    },
    [decreaseQuantity, savePatch]
  );

  const moveItem = useCallback(
    (id: number, x: number, y: number) => {
      setPlacedItems((prev) => {
        const normalized = normalizeZIndex(prev);
        const target = normalized.find((item) => item.id === id);
        if (!target) return normalized;

        const updated = normalized
          .filter((item) => item.id !== id)
          .map((it, index) => ({ ...it, zIndex: index + 1 }));

        const zIndex = updated.length + 1;
        const movedItem: RoomItem = { ...target, x, y, zIndex };

        // lưu patch ngay khi move
        persistUpsert(movedItem);

        return [...updated, movedItem];
      });
    },
    [savePatch]
  );

  const updateRotation = useCallback(
    (id: number, rotation: number) => {
      setPlacedItems((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, rotation } : item
        );
        const item = updated.find((it) => it.id === id);
        if (item) persistUpsert(item);
        return updated;
      });
    },
    [savePatch]
  );

  const bringToFront = useCallback(
    (id: number) => {
      setPlacedItems((prev) => {
        let updated = normalizeZIndex(prev);
        const target = updated.find((it) => it.id === id);
        if (!target) return updated;
        updated = updated.filter((it) => it.id !== id);
        const zIndex = updated.length + 1;
        const movedItem = { ...target, zIndex };
        updated.push(movedItem);
        // save patch so z-order survived crash
        persistUpsert(movedItem);
        return normalizeZIndex(updated);
      });
    },
    [savePatch]
  );

  const removeItem = useCallback(
    (id: number) => {
      setPlacedItems((prev) => {
        const target = prev.find((it) => it.id === id);
        if (target) {
          increaseQuantity(target.item.id);
          if (target.item.categoryId === 2)
            setDecorCount((c) => Math.max(0, c - 1));
          if (target.item.categoryId === 1)
            setFrameCount((c) => Math.max(0, c - 1));
        }
        const filtered = prev.filter((item) => item.id !== id);
        return normalizeZIndex(filtered);
      });
      setPlacedItemMemories((prev) => {
        const newMemories = { ...prev };
        delete newMemories[id];
        return newMemories;
      });
      savePatch({ op: "removeItem", itemId: id });
    },
    [increaseQuantity, savePatch]
  );

  const setItemMemory = useCallback(
    async (itemId: number, slotId: number, memory: Memory) => {
      const memoryId = memory.id;
      setPlacedItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                slotMemories: {
                  ...item.slotMemories,
                  [slotId]: memoryId,
                },
              }
            : item
        )
      );

      if (memoryId) {
        savePatch({
          op: "setSlotMemory",
          roomItemId: itemId,
          slotId,
          memoryId,
        });
        await memoryService.setMemory(roomId, itemId, slotId, memory);
      } else {
        savePatch({ op: "deleteSlotMemory", roomItemId: itemId, slotId });
      }
    },
    [savePatch, roomId]
  );

  const updateItemMemory = useCallback(
    async (itemId: number, slotId: number, memory: Memory) => {
      setPlacedItemMemories((prev) => ({
        ...prev,
        [itemId]: {
          ...(prev[itemId] ?? {}),
          [slotId]: memory,
        },
      }));
      await memoryService.setMemory(roomId, itemId, slotId, memory);
      const memoryId = memory.id;

      savePatch({
        op: "updateSlotMemory",
        roomItemId: itemId,
        slotId,
        memoryId,
      });
    },
    [roomId, savePatch]
  );

  const deleteItemMemory = useCallback(
    async (itemId: number, slotId: number) => {
      const memory = placedItemMemories[itemId]?.[slotId];
      if (memory) {
        await memoryService.deleteMemory(roomId, itemId, slotId);
      }

      setPlacedItemMemories((prev) => {
        const newMemories = { ...prev };
        if (newMemories[itemId]) {
          const updatedSlots = { ...newMemories[itemId] };
          delete updatedSlots[slotId];
          if (Object.keys(updatedSlots).length === 0) {
            delete newMemories[itemId]; // frame không còn slot nào
          } else {
            newMemories[itemId] = updatedSlots;
          }
        }
        return newMemories;
      });

      savePatch({ op: "deleteSlotMemory", roomItemId: itemId, slotId });
    },
    [savePatch, placedItemMemories, roomId]
  );

  return {
    placedItems,
    placedItemMemories,
    placeItem,
    moveItem,
    updateRotation,
    bringToFront,
    removeItem,
    setItemMemory,
    updateItemMemory,
    deleteItemMemory,
    decorCount,
    frameCount,
    MAX_DECOR,
    MAX_FRAME,
  };
};
