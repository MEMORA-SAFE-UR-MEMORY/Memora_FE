import { useThemeContext } from "@src/context/ThemeContext";
import { useDraft } from "@src/hooks/useDraft";
import { DraftManager } from "@src/services/draftService";
import * as service from "@src/services/roomService";
import { Draft, RoomDetail } from "@src/types/room";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export const useRoom = (
  roomId?: number,
  themeId?: number,
  initialType?: "private" | "public",
  initialRoom?: RoomDetail | null,
  draft?: Draft,
  back?: string
) => {
  const { themes } = useThemeContext();
  const { compactDraft } = useDraft(roomId!);
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  // Setting modal
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  

  // load once từ props
  useEffect(() => {
    if (!roomId || !themeId) return;

    const fetchAndSetRoom = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch room từ API
        const room = await service.getRoom(roomId);

        // 2. Tìm theme dựa vào themeId
        const theme = themes.find((t) => t.id === themeId);
        if (!theme) {
          setError("Theme not found");
          setRoomDetail(null);
          return;
        }

        // 3. Update roomDetail với theme và các thông tin cơ bản
        const updatedRoom: RoomDetail = {
          ...room,
          theme,
        };

        setRoomDetail(updatedRoom);
      } catch (err: any) {
        setError(err.message || "Failed to load room");
        setRoomDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetRoom();
  }, [roomId, themeId, themes]);

  // Setting controls
  const openSetting = () => setIsSettingOpen(true);
  const closeSetting = () => setIsSettingOpen(false);

  // cập nhật type
  const updateType = useCallback(
    async (newType: "private" | "public") => {
      if (!roomDetail) throw new Error("Room not loaded");

      setUpdating(true);
      setError(null);

      const prev = roomDetail;
      // optimistic update
      setRoomDetail({ ...roomDetail, type: newType });

      try {
        await service.setRoomType(roomDetail.id, newType);
      } catch (err: any) {
        // rollback
        setRoomDetail(prev);
        setError(err.message || "Update failed");
      } finally {
        setUpdating(false);
      }
    },
    [roomDetail]
  );

  const goBack = () => {
    if (back) {
      router.replace(back as any);
    } else {
      router.replace("/hall");
    }
  };

  const exitToHall = async (hasChanges?: boolean) => {
    try {
      if (!initialRoom || !draft) {
        goBack();
        return;
      }

      if (!hasChanges) {
        // User chỉ xem room, không chỉnh sửa
        goBack();
        return;
      }

      // Nếu có chỉnh sửa thì mới gọi save
      const compacted = await compactDraft();
      if (compacted) {
        const appliedRoom = DraftManager.applyDraft(initialRoom, compacted);
        await service.saveRoom(appliedRoom, compacted);
      }
      goBack();
    } catch (err) {
      console.error("Save room failed:", err);
      goBack();
    }
  };

  const handleSaveSetting = (type: "private" | "public") => {
    updateType(type);
    closeSetting();
  };

  return {
    roomDetail,
    loading,
    error,
    updating,
    updateType,
    exitToHall,

    // Setting
    isSettingOpen,
    openSetting,
    closeSetting,
    handleSaveSetting,
  };
};
