import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";

export type Slot = { x: number; y: number; w: number; h: number; uri?: string };
export type PageTemplate = { background: any; slots: Slot[] };

const STORAGE_PREFIX = "album_";

export function useAlbum(albumId: string, templates: PageTemplate[]) {
  const [pages, setPages] = useState<PageTemplate[]>(templates);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_PREFIX + albumId);
      if (saved) {
        const data = JSON.parse(saved);
        setPages(data.pages);
        setConfirmed(data.confirmed);
      }
    })();
  }, []);

  // Save mỗi khi thay đổi
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_PREFIX + albumId,
      JSON.stringify({ pages, confirmed })
    );
  }, [pages, confirmed]);

  const pickImage = async (pageIndex: number, slotIndex: number) => {
    if (confirmed) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Image],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newPages = [...pages];
      newPages[pageIndex].slots[slotIndex].uri = result.assets[0].uri;
      setPages(newPages);
    }
  };

  const confirmAlbum = () => setConfirmed(true);

  return { pages, confirmed, pickImage, confirmAlbum };
}
