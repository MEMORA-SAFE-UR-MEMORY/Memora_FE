import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeRealtime } from "@src/hooks/useThemeRealTime";
import * as themeService from "@src/services/themeService";
import { Theme } from "@src/types/theme";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface ThemeContextValue {
  themes: Theme[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadThemes = useCallback(async () => {
    // await AsyncStorage.removeItem("themes");
    setLoading(true);
    setError(null);
    try {
      const data = await themeService.getThemes();
      setThemes(data);
      console.log("theme: ", data);
    } catch (err: any) {
      setError(err.message || "Lỗi khi load themes");
    } finally {
      setLoading(false);
    }
  }, []);

  // load lần đầu khi app start
  useEffect(() => {
    loadThemes();
  }, [loadThemes]);

  // realtime listener: khi supabase có thay đổi thì gọi setThemes
  useThemeRealtime((updated) => {
    setThemes(updated);
  });

  const value: ThemeContextValue = {
    themes,
    loading,
    error,
    reload: loadThemes,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
}
