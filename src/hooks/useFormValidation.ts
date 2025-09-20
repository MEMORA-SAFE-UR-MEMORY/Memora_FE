import { Memory } from "@src/hooks/useMemory";

export const useFormValidation = (data: Memory, original?: Memory) => {
  const isFormValid =
    data.title.trim() !== "" && data.date !== "" && data.image !== null;

  const isChanged = original
    ? data.title !== original.title ||
      data.description !== original.description ||
      data.image !== original.image ||
      data.date !== original.date
    : true;

  return { isFormValid, isChanged };
};
