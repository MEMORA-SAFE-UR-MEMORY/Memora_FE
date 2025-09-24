import { useInventory } from "@src/context/InventoryContext";
import { useRoomDecoration } from "@src/hooks/useRoomDecoration";
import { InventoryItem, RoomItem } from "@src/types/item";
import { Memory } from "@src/types/memory";
import { useState } from "react";
import { useWindowDimensions } from "react-native";

type ModalType = "add" | "view" | null;

export const useMemory = (scrollX: number = 0) => {
  const { decreaseQuantity, increaseQuantity } = useInventory();

  const {
    placedItems,
    placedItemMemories,
    placeItem,
    moveItem,
    setItemMemory,
    updateItemMemory,
    deleteItemMemory,
    removeItem,
  } = useRoomDecoration({ decreaseQuantity, increaseQuantity });

  const { width, height } = useWindowDimensions();

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

  // Inventory controls
  const openInventory = () => setIsInventoryOpen(true);
  const closeInventory = () => setIsInventoryOpen(false);

  // Modal controls
  const openModal = (
    type: "add" | "view",
    memory?: Memory,
    frameId?: number
  ) => {
    setTimeout(() => {
      setModalType(type);
      setSelectedMemory(memory ?? null);
      setActiveFrameId(frameId ?? null);
    }, 300);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedMemory(null);
    setActiveFrameId(null);
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
  const handleFramePress = (frameId: number) => {
    setActiveFrameId(frameId);
    const memory = placedItemMemories[frameId];

    if (memory) {
      openModal("view", memory, frameId);
    } else {
      openModal("add", undefined, frameId);
    }
  };

  // Memory operations
  const handleSaveMemory = (memory: Memory) => {
    if (activeFrameId !== null) {
      setItemMemory(activeFrameId, memory);
    }
    closeModal();
  };

  const handleUpdateMemory = (memory: Memory) => {
    if (activeFrameId !== null) {
      updateItemMemory(activeFrameId, memory);
    }
    setSelectedMemory(memory);
  };

  const handleDeleteMemory = () => {
    if (activeFrameId !== null) {
      deleteItemMemory(activeFrameId);
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

  return {
    // State
    modalType,
    selectedMemory,
    activeFrameId,
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
    removeItem: removeItemWithModalCheck,

    // Frame interactions
    handleFramePress,

    // Memory operations
    handleSaveMemory,
    handleUpdateMemory,
    handleDeleteMemory,
  };
};
