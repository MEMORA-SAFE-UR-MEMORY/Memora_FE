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

  // Thêm item vào phòng
  const placeItem = useCallback(
    (newItem: Omit<RoomItem, "id">): RoomItem => {
      const roomItem: RoomItem = {
        ...newItem,
        id: Date.now(),
      };
      setPlacedItems((prev) => [...prev, roomItem]);

      decreaseQuantity(newItem.item.id);

      return roomItem;
    },
    [decreaseQuantity]
  );

  const moveItem = useCallback((id: number, x: number, y: number) => {
    setPlacedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x, y } : item))
    );
  }, []);

  const removeItem = useCallback(
    (id: number) => {
      setPlacedItems((prev) => {
        const target = prev.find((it) => it.id === id);
        if (target) {
          increaseQuantity(target.item.id);
        }
        return prev.filter((item) => item.id !== id);
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
    removeItem,
    setItemMemory,
    updateItemMemory,
    deleteItemMemory,
  };
};
