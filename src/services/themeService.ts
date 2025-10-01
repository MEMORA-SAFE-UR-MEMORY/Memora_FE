import { themeRepo } from "@src/repositories/themeRepo";
import { fetchAllThemes } from "@src/apis/themeApi";
import { Theme } from "@src/types/theme";

export async function getThemes(forceRefresh = false): Promise<Theme[]> {
  if (!forceRefresh) {
    const cached = await themeRepo.getThemes();
    if (cached) return cached;
  }

  const remote = await fetchAllThemes();
  await themeRepo.saveThemes(remote);
  return remote;
}
