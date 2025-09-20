import { useState } from "react";

export type Memory = {
  title: string;
  description: string;
  image: string | null;
  date: string;
};

export const useMemory = () => {
  const [modalType, setModalType] = useState<"add" | "view" | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const openModal = () => setModalType(selectedMemory ? "view" : "add");
  const closeModal = () => setModalType(null);

  const saveMemory = (data: Memory) => {
    setSelectedMemory(data);
    setModalType(null);
  };

  const updateMemory = (data: Memory) => setSelectedMemory(data);

  const deleteMemory = () => {
    setTimeout(() => {
      setSelectedMemory(null);
      setModalType(null);
    }, 300);
  };

  return {
    modalType,
    selectedMemory,
    openModal,
    closeModal,
    saveMemory,
    updateMemory,
    deleteMemory,
  };
};
