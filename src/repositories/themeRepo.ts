import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme } from "@src/types/theme";

const THEME_CACHE_KEY = "themes";

export const themeRepo = {
  async saveThemes(themes: Theme[]) {
    try {
      await AsyncStorage.setItem(THEME_CACHE_KEY, JSON.stringify(themes));
    } catch (err) {
      console.warn("themeRepo.saveThemes error", err);
    }
  },

  async getThemes(): Promise<Theme[] | null> {
    try {
      const raw = await AsyncStorage.getItem(THEME_CACHE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as Theme[];
    } catch (err) {
      console.warn("themeRepo.getThemes error", err);
      return null;
    }
  },

  async clearThemes() {
    try {
      await AsyncStorage.removeItem(THEME_CACHE_KEY);
    } catch (err) {
      console.warn("themeRepo.clearThemes error", err);
    }
  },
};
