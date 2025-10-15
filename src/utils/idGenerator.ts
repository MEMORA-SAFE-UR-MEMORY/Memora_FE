let tempCounter = 0;

export const generateTempId = (): number => {
  tempCounter += 1;

  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const uniqueId = Number(`${timestamp}${random}${tempCounter}`);

  return -uniqueId; // dùng số âm để phân biệt ID tạm
};

export const isTempId = (id: any): boolean => {
  return typeof id === "number" && id < 0;
};
