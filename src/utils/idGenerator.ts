let counter = 0;
export const generateTempId = () => {
  counter += 1;
  // Ghép Date.now() và counter để tránh trùng
  return Date.now() * 1000 + counter;
};
