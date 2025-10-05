import { supabase } from "@src/lib/supabase";
import { themeRepo } from "@src/repositories/themeRepo";
import * as themeService from "@src/services/themeService";
import { Theme } from "@src/types/theme";
import { useEffect } from "react";

export function useThemeRealtime(onChange?: (themes: Theme[]) => void) {
  useEffect(() => {
    const channel = supabase
      .channel("themes-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "themes" },
        async (payload) => {
          console.log("Theme changed:", payload);

          // fetch lại toàn bộ themes
          const updated = await themeService.getThemes(true);

          // callback cho ThemeProvider cập nhật state
          if (onChange) {
            onChange(updated);
          }

          // lưu cache mới
          await themeRepo.saveThemes(updated);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}
