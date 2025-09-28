// hooks/useRoomDecoration.ts
import { RoomItem } from "@src/types/item";
import { Memory } from "@src/types/memory";
import { useCallback, useState } from "react";

type UseRoomDecorationParams = {
  decreaseQuantity: (itemId: number) => void;
  increaseQuantity: (itemId: number) => void;
};

export const useRoomDecoration = ({
  decreaseQuantity,
  increaseQuantity,
}: UseRoomDecorationParams) => {
  const [placedItems, setPlacedItems] = useState<RoomItem[]>([]);
  const [placedItemMemories, setPlacedItemMemories] = useState<
    Record<number, Memory>
  >({});

  const normalizeZIndex = (items: RoomItem[]): RoomItem[] => {
    return [...items]
      .sort((a, b) => a.zIndex - b.zIndex)
      .map((item, index) => ({
        ...item,
        zIndex: index + 1,
      }));
  };

  // Thêm item vào phòng
  const placeItem = useCallback(
    (newItem: Omit<RoomItem, "id">): RoomItem => {
      let roomItem: RoomItem;
      setPlacedItems((prev) => {
        const updated = normalizeZIndex(prev);
        roomItem = {
          ...newItem,
          id: Date.now(),
          zIndex: updated.length + 1,
        };
        return [...updated, roomItem];
      });
      decreaseQuantity(newItem.item.id);
      return roomItem!;
    },
    [decreaseQuantity]
  );

  const moveItem = useCallback((id: number, x: number, y: number) => {
    setPlacedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x, y } : item))
    );
  }, []);

  const updateRotation = useCallback((id: number, rotation: number) => {
    setPlacedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, rotation } : item))
    );
  }, []);

  const bringToFront = useCallback((id: number) => {
    setPlacedItems((prev) => {
      const updated = normalizeZIndex(prev);

      const target = updated.find((it) => it.id === id);
      if (!target) return updated;

      const lowered = updated.map((it) =>
        it.id === id ? it : { ...it, zIndex: it.zIndex - 1 }
      );

      return lowered.map((it) =>
        it.id === id ? { ...it, zIndex: updated.length } : it
      );
    });
  }, []);

  const removeItem = useCallback(
    (id: number) => {
      setPlacedItems((prev) => {
        const target = prev.find((it) => it.id === id);
        if (target) {
          increaseQuantity(target.item.id);
        }
        const filtered = prev.filter((item) => item.id !== id);
        return normalizeZIndex(filtered);
      });
      setPlacedItemMemories((prev) => {
        const newMemories = { ...prev };
        delete newMemories[id];
        return newMemories;
      });
    },
    [increaseQuantity]
  );

  const setItemMemory = useCallback((itemId: number, memory: Memory) => {
    setPlacedItemMemories((prev) => ({
      ...prev,
      [itemId]: memory,
    }));
  }, []);

  const updateItemMemory = useCallback((itemId: number, memory: Memory) => {
    setPlacedItemMemories((prev) => ({
      ...prev,
      [itemId]: memory,
    }));
  }, []);

  const deleteItemMemory = useCallback((itemId: number) => {
    setPlacedItemMemories((prev) => {
      const newMemories = { ...prev };
      delete newMemories[itemId];
      return newMemories;
    });
  }, []);

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
  };
};
