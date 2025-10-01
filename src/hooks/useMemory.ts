import { useInventory } from "@src/context/InventoryContext";
import { useRoomDecoration } from "@src/hooks/useRoomDecoration";
import { memoryService } from "@src/services/memoryService";
import { InventoryItem, RoomItem } from "@src/types/item";
import { Memory } from "@src/types/memory";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

type ModalType = "add" | "view" | null;

export const useMemory = (
  roomId: number,
  scrollX: number = 0,
  baseItems: RoomItem[]
) => {
  const { decreaseQuantity, increaseQuantity } = useInventory();

  const {
    placedItems,
    placedItemMemories,
    placeItem,
    moveItem,
    updateRotation,
    bringToFront,
    setItemMemory,
    updateItemMemory,
    deleteItemMemory,
    removeItem,
  } = useRoomDecoration({
    decreaseQuantity,
    increaseQuantity,
    roomId,
    baseItems,
  });

  const { width, height } = useWindowDimensions();

  // Memory store từ AsyncStorage
  const [memoryStore, setMemoryStore] = useState<Record<number, Memory>>({});

  useEffect(() => {
    (async () => {
      const store = await memoryService.loadStore(roomId);
      setMemoryStore(store);
    })();
  }, [roomId]);

  useEffect(() => {
    (async () => {
      await memoryService.saveStore(roomId, memoryStore);
    })();
  }, [roomId, memoryStore]);

  // Trash zone state
  const [trashLayout, setTrashLayout] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [isTrashActive, setIsTrashActive] = useState(false);
  const [showTrash, setShowTrash] = useState(false);

  // Inventory modal
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  // Memory modal
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [activeFrameId, setActiveFrameId] = useState<number | null>(null);
  const [activeSlotId, setActiveSlotId] = useState<number | null>(null);

  // Inventory controls
  const openInventory = () => setIsInventoryOpen(true);
  const closeInventory = () => setIsInventoryOpen(false);

  // Modal controls
  const openModal = (
    type: "add" | "view",
    memory?: Memory,
    frameId?: number,
    slotId?: number
  ) => {
    setTimeout(() => {
      setModalType(type);
      setSelectedMemory(memory ?? null);
      setActiveFrameId(frameId ?? null);
      setActiveSlotId(slotId ?? null);
    }, 300);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedMemory(null);
    setActiveFrameId(null);
    setActiveSlotId(null);
  };

  // Khi chọn item từ inventory → spawn vào Room
  const handleItemSelect = (inventoryItem: InventoryItem) => {
    const frameSize = 120; // khung 120x120
    const visibleWidth = width * 0.65;

    // căn giữa frame trong vùng 65%
    const spawnX = scrollX + (visibleWidth - frameSize) / 2;
    const spawnY = height / 3;

    const newRoomItem: Omit<RoomItem, "id"> = {
      x: spawnX,
      y: spawnY,
      zIndex: placedItems.length + 1,
      item: inventoryItem.item,
    };

    const placed = placeItem(newRoomItem); // trả về RoomItem { id: number, ... }
    return placed.id;
  };

  // Khi bấm vào frame (có thể có hoặc chưa có Memory)
  const handleFramePress = (frameId: number, slotId: number | null) => {
    setActiveFrameId(frameId);
    setActiveSlotId(slotId);

    if (slotId !== null) {
      const memory = resolveMemory(frameId, slotId);
      if (memory) {
        openModal("view", memory, frameId, slotId);
      } else {
        openModal("add", undefined, frameId, slotId);
      }
    }
  };

  // Memory operations
  const handleSaveMemory = async (
    frameId: number,
    slotId: number,
    memory: Memory
  ) => {
    const updated = await memoryService.addOrUpdate(roomId, memory);
    setMemoryStore(updated);
    setItemMemory(frameId, slotId, memory);
  };

  const handleUpdateMemory = async (
    frameId: number,
    slotId: number,
    memory: Memory
  ) => {
    updateItemMemory(frameId, slotId, memory);
    const updated = await memoryService.addOrUpdate(roomId, memory);
    setMemoryStore(updated);
    setSelectedMemory(memory);
  };

  const handleDeleteMemory = async () => {
    if (activeFrameId !== null && activeSlotId !== null && selectedMemory) {
      deleteItemMemory(activeFrameId, activeSlotId);
      const updated = await memoryService.delete(roomId, selectedMemory.id);
      setMemoryStore(updated);
    }
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  // Xóa item khỏi room
  const removeItemWithModalCheck = (id: number) => {
    removeItem(id);

    if (activeFrameId === id) {
      setActiveFrameId(null);
    }
  };

  const resolveMemory = (frameId: number, slotId: number): Memory | null => {
    const roomItem = placedItems.find((item) => item.id === frameId);
    if (!roomItem) return null;

    const memoryId = roomItem.slotMemories?.[slotId];
    if (!memoryId) return null;

    return memoryStore[memoryId] ?? null;
  };

  return {
    // State
    modalType,
    selectedMemory,
    activeFrameId,
    activeSlotId,
    placedItems,
    placedItemMemories,
    isInventoryOpen,
    trashLayout,
    setTrashLayout,
    isTrashActive,
    setIsTrashActive,
    showTrash,
    setShowTrash,

    // Inventory
    openInventory,
    closeInventory,

    // Modal
    openModal,
    closeModal,

    // Item operations
    handleItemSelect,
    moveItem,
    updateRotation,
    bringToFront,
    removeItem: removeItemWithModalCheck,

    // Frame interactions
    handleFramePress,

    // Memory operations
    handleSaveMemory,
    handleUpdateMemory,
    handleDeleteMemory,

    // Resolve
    resolveMemory,
  };
};
