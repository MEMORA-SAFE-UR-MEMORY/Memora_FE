// hooks/useMemory.ts - Enhanced version with room decoration logic
import { useRoomDecoration } from "@src/hooks/useRoomDecoration";
import { Memory } from "@src/types/memory";
import { useState } from "react";
import { useWindowDimensions } from "react-native";

type ModalType = "add" | "view" | null;

export const useMemory = () => {
  // Room decoration integration
  const {
    placedItems,
    placedItemMemories,
    placeItem,
    moveItem,
    setItemMemory,
    updateItemMemory,
    deleteItemMemory,
    removeItem,
  } = useRoomDecoration();

  const { width, height } = useWindowDimensions();

  // Trash
  const [trashLayout, setTrashLayout] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [isTrashActive, setIsTrashActive] = useState(false);
  const [showTrash, setShowTrash] = useState(false);

  // Inventory state
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  // Modal state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [activeFrameId, setActiveFrameId] = useState<string | null>(null);

  // Inventory controls
  const openInventory = () => {
    setIsInventoryOpen(true);
  };
  const closeInventory = () => {
    setIsInventoryOpen(false);
  };

  // Modal controls
  const openModal = (
    type: "add" | "view",
    memory?: Memory,
    frameId?: string
  ) => {
    setTimeout(() => {
      setModalType(type);
      setSelectedMemory(memory || null);
      setActiveFrameId(frameId || null);
    }, 300);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedMemory(null);
    setActiveFrameId(null);
  };

  // Item placement
  const handleItemSelect = (frameUrl: any) => {
    const frameSize = 120; // khung 120x120
    const visibleWidth = width * 0.65;

    // căn giữa frame trong vùng 65%
    const spawnX = (visibleWidth - frameSize) / 2;
    const spawnY = height / 3;

    placeItem(frameUrl, spawnX, spawnY);
  };

  // Frame interaction
  const handleFramePress = (frameId: string) => {
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
    if (activeFrameId) {
      setItemMemory(activeFrameId, memory);
    }
    closeModal();
  };

  const handleUpdateMemory = (memory: Memory) => {
    if (activeFrameId) {
      updateItemMemory(activeFrameId, memory);
    }
    setSelectedMemory(memory);
  };

  const handleDeleteMemory = () => {
    if (activeFrameId) {
      deleteItemMemory(activeFrameId);
    }
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  // Xóa frame
  const removeItemWithModalCheck = (id: string) => {
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

    // Inventory controls
    openInventory,
    closeInventory,

    // Modal controls
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
