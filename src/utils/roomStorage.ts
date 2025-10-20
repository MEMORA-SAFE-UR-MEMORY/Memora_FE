import AsyncStorage from "@react-native-async-storage/async-storage";

export const PUBLIC_ROOMS_CACHE_KEY = "public_rooms_cache";
export const PUBLIC_ROOMS_FETCH_TIME_KEY = "public_rooms_last_fetch";

export const saveToStorage = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getFromStorage = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const removeFromStorage = async (key: string) => {
  await AsyncStorage.removeItem(key);
};
