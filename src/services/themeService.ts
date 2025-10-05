import { fetchAllThemes } from "@src/apis/themeApi";
import { themeRepo } from "@src/repositories/themeRepo";
import { Theme } from "@src/types/theme";

export async function getThemes(): Promise<Theme[]> {
  try {
    // luôn fetch từ server
    const remote = await fetchAllThemes();
    await themeRepo.saveThemes(remote); // vẫn lưu cache để offline dùng
    return remote;
  } catch (err) {
    console.warn("getThemes: fetch remote failed, fallback cache", err);
    // fallback cache nếu online fetch fail
    const cached = await themeRepo.getThemes();
    return cached ?? [];
  }
}
