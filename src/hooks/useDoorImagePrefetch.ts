import { useEffect, useMemo } from "react";
import { Image } from "react-native";
import { Door } from "services/rooms/type";

type ThemeWithDoor = { door_id: number | null };

export function useDoorImagePrefetch(
  doors: Door[] | undefined | null,
  selectedDoorId: number | null,
  themeDropdownOpen: boolean,
  themeOptions: ThemeWithDoor[]
) {
  const doorById = useMemo(() => {
    const m = new Map<number, Door>();
    (doors ?? []).forEach((d) => m.set(d.id, d));
    return m;
  }, [doors]);

  const getDoorImgUrl = (door?: Door | null) => {
    const u = (door as any)?.img_url as string | undefined;
    return typeof u === "string" && u.length > 0 ? u : null;
  };

  // Prefetch khi chọn door (ví dụ: theme Giáng sinh có cửa riêng)
  useEffect(() => {
    if (!selectedDoorId) return;
    const d = doorById.get(selectedDoorId);
    const url = getDoorImgUrl(d);
    if (url) Image.prefetch(url).catch(() => {});
  }, [selectedDoorId, doorById]);

  // Prefetch trước vài ảnh khi mở dropdown chủ đề
  useEffect(() => {
    if (!themeDropdownOpen) return;
    const urls: string[] = [];
    for (const opt of themeOptions) {
      if (!opt?.door_id) continue;
      const d = doorById.get(opt.door_id);
      const u = getDoorImgUrl(d);
      if (u) urls.push(u);
      if (urls.length >= 5) break; // tránh overfetch
    }
    urls.forEach((u) => Image.prefetch(u).catch(() => {}));
  }, [themeDropdownOpen, themeOptions, doorById]);
}
