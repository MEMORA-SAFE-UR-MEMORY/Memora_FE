export const formatDate = (dateInput: string | Date) => {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString("vi-VN");
};
