import { useInventory } from "@src/context/InventoryContext";
import { useRoomDecoration } from "@src/hooks/useRoomDecoration";
import { memoryService, MemoryStore } from "@src/services/memoryService";
import { InventoryItem, RoomItem } from "@src/types/item";
import { Memory } from "@src/types/memory";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { SharedValue } from "react-native-reanimated";

type ModalType = "add" | "view" | null;

export const useMemory = (
  roomId: number,
  scrollX: SharedValue<number>,
  baseItems: RoomItem[],
  mode: "view" | "edit" = "edit"
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
    decorCount,
    frameCount,
    MAX_DECOR,
    MAX_FRAME,
  } = useRoomDecoration({
    decreaseQuantity,
    increaseQuantity,
    roomId,
    baseItems,
  });

  const { categories } = useInventory();

  const { width, height } = useWindowDimensions();

  // Memory store từ AsyncStorage (roomItemId → slotId → Memory)
  const [memoryStore, setMemoryStore] = useState<MemoryStore>({});

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

  // Edit mode
  const [activeEditingFrameId, setActiveEditingFrameId] = useState<
    number | null
  >(null);
  const editTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inventory modal
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isInventoryDisabled, setIsInventoryDisabled] = useState(false);

  // Memory modal
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [activeFrameId, setActiveFrameId] = useState<number | null>(null);
  const [activeFrameItem, setActiveFrameItem] = useState<RoomItem | null>(null);
  const [activeSlotId, setActiveSlotId] = useState<number | null>(null);

  // Noti modal
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [NotiInven, setNotiInven] = useState<{
    show: boolean;
    categoryId: number | null;
  }>({
    show: false,
    categoryId: null,
  });

  // Inventory controls
  const openInventory = () => {
    if (isInventoryDisabled) {
      setNotiInven({
        show: true,
        categoryId: null,
      });
      return;
    }
    setIsInventoryOpen(true);
  };
  const closeInventory = () => setIsInventoryOpen(false);

  // Noti controls
  const closeNoti = () => setIsNotiOpen(false);

  const disabledCategories = useMemo(() => {
    const disabled: number[] = [];
    if (decorCount >= MAX_DECOR) disabled.push(2);
    if (frameCount >= MAX_FRAME) disabled.push(1);
    return disabled;
  }, [decorCount, frameCount]);

  useEffect(() => {
    if (disabledCategories.length === categories.length) {
      setIsInventoryDisabled(true);
      closeInventory();
    } else {
      setIsInventoryDisabled(false);
    }
  }, [disabledCategories, categories, closeInventory]);

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

  // Edit mode
  // Hàm bắt đầu đếm ngược
  const startEditCountdown = () => {
    if (editTimer.current) clearTimeout(editTimer.current);
    editTimer.current = setTimeout(() => {
      setActiveEditingFrameId(null);
      editTimer.current = null;
    }, 10000);
  };

  // Vào edit mode
  const enterEditMode = (frameId: number) => {
    setActiveEditingFrameId(frameId);

    // Nếu có timer trước đó thì clear (đảm bảo không chạy song song)
    if (editTimer.current) clearTimeout(editTimer.current);

    // Không start countdown ngay, chỉ start khi user rời tay
  };

  // Thoát edit mode
  const exitEditMode = () => {
    setActiveEditingFrameId(null);
    if (editTimer.current) {
      clearTimeout(editTimer.current);
      editTimer.current = null;
    }
  };

  // Khi user bắt đầu chạm => clear timer
  const onUserInteractionStart = () => {
    if (editTimer.current) {
      clearTimeout(editTimer.current);
      editTimer.current = null;
    }
  };

  // Khi user kết thúc tương tác => restart timer
  const onUserInteractionEnd = () => {
    if (activeEditingFrameId) {
      startEditCountdown();
    }
  };

  // Khi chọn item từ inventory → spawn vào Room
  const handleItemSelect = (inventoryItem: InventoryItem) => {
    const frameSize = 120; // khung 120x120
    const visibleWidth = width * 0.65;

    // căn giữa frame trong vùng 65%
    const spawnX = scrollX.value + (visibleWidth - frameSize) / 2;
    const spawnY = height / 3;

    const newRoomItem: Omit<RoomItem, "id"> = {
      x: spawnX,
      y: spawnY,
      zIndex: placedItems.length + 1,
      item: inventoryItem.item,
    };

    const placed = placeItem(newRoomItem); // trả về RoomItem { id: number, ... }

    if (
      (inventoryItem.item.categoryId === 2 && decorCount + 1 === MAX_DECOR) ||
      (inventoryItem.item.categoryId === 1 && frameCount + 1 === MAX_FRAME)
    ) {
      setIsNotiOpen(true);
    }

    return placed.id;
  };

  // Khi bấm vào frame (có thể có hoặc chưa có Memory)
  const handleFramePress = (
    frameId: number,
    slotId: number | null,
    frameItem: RoomItem
  ) => {
    setActiveFrameId(frameId);
    setActiveSlotId(slotId);
    setActiveFrameItem(frameItem);

    if (slotId !== null) {
      const memory = resolveMemory(frameId, slotId);

      if (memory) {
        openModal("view", memory, frameId, slotId);
      } else if (mode === "edit") {
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
    if (mode === "view") return;
    const updated = await memoryService.setMemory(
      roomId,
      frameId,
      slotId,
      memory
    );
    setMemoryStore(updated);
    setItemMemory(frameId, slotId, memory);
  };

  const handleUpdateMemory = async (
    frameId: number,
    slotId: number,
    memory: Memory
  ) => {
    if (mode === "view") return;
    updateItemMemory(frameId, slotId, memory);
    const updated = await memoryService.setMemory(
      roomId,
      frameId,
      slotId,
      memory
    );
    setMemoryStore(updated);
    setSelectedMemory(memory);
  };

  const handleDeleteMemory = async () => {
    if (mode === "view") return;
    if (activeFrameId !== null && activeSlotId !== null && selectedMemory) {
      deleteItemMemory(activeFrameId, activeSlotId);
      const updated = await memoryService.deleteMemory(
        roomId,
        activeFrameId,
        activeSlotId
      );
      setMemoryStore(updated);
    }
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  // Xóa item khỏi room
  const removeItemWithModalCheck = (id: number) => {
    if (mode === "view") return;
    removeItem(id);

    if (activeFrameId === id) {
      setActiveFrameId(null);
    }
  };

  const resolveMemory = (frameId: number, slotId: number): Memory | null => {
    return memoryStore[frameId]?.[slotId] ?? null;
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
    activeFrameItem,
    setActiveFrameItem,

    // Inventory
    openInventory,
    closeInventory,

    // Modal
    openModal,
    closeModal,

    // Noti
    isNotiOpen,
    closeNoti,

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

    // Count item
    decorCount,
    frameCount,
    MAX_DECOR,
    MAX_FRAME,
    disabledCategories,
    NotiInven,
    setNotiInven,
    isInventoryDisabled,

    // Edit mode
    activeEditingFrameId,
    enterEditMode,
    exitEditMode,
    onUserInteractionEnd,
    onUserInteractionStart,
  };
};
