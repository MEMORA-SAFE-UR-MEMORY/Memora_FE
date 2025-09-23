// hooks/useRoomDecoration.ts
import { PlacedItem } from "@src/types/item";
import { Memory } from "@src/types/memory";
import { useCallback, useState } from "react";

export const useRoomDecoration = () => {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [placedItemMemories, setPlacedItemMemories] = useState<
    Record<string, Memory>
  >({});

  const placeItem = useCallback(
    (frameUrl: any, initialX: number = 100, initialY: number = 100) => {
      const newItem: PlacedItem = {
        id: `placed-${Date.now()}`,
        type: "frame",
        frameUrl,
        x: initialX,
        y: initialY,
      };
      setPlacedItems((prev) => [...prev, newItem]);
      return newItem.id;
    },
    []
  );

  const moveItem = useCallback((id: string, x: number, y: number) => {
    setPlacedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x, y } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setPlacedItems((prev) => prev.filter((item) => item.id !== id));
    setPlacedItemMemories((prev) => {
      const newMemories = { ...prev };
      delete newMemories[id];
      return newMemories;
    });
  }, []);

  const setItemMemory = useCallback((itemId: string, memory: Memory) => {
    setPlacedItemMemories((prev) => ({
      ...prev,
      [itemId]: memory,
    }));
  }, []);

  const updateItemMemory = useCallback((itemId: string, memory: Memory) => {
    setPlacedItemMemories((prev) => ({
      ...prev,
      [itemId]: memory,
    }));
  }, []);

  const deleteItemMemory = useCallback((itemId: string) => {
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
