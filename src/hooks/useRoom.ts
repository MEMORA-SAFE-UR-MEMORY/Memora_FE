import { useThemeContext } from "@src/context/ThemeContext";
import { useDraft } from "@src/hooks/useDraft";
import { DraftManager } from "@src/services/draftService";
import * as service from "@src/services/roomService";
import { Draft, RoomDetail, RoomType } from "@src/types/room";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

export const useRoom = (
  roomId?: number,
  themeId?: number,
  initialType?: RoomType,
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

  const initialRoomRef = useRef<RoomDetail | null>(
    initialRoom ? structuredClone(initialRoom) : null
  );

  // Setting modal
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const fetchAndSetRoom = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch room từ API
      if (!roomId || !themeId) return;
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
      if (!initialRoomRef.current) {
        initialRoomRef.current = structuredClone(updatedRoom);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load room");
      setRoomDetail(null);
    } finally {
      setLoading(false);
    }
  }, [roomId, themeId, themes]);

  // load once từ props
  useEffect(() => {
    fetchAndSetRoom();
  }, [fetchAndSetRoom]);

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
      setRoomDetail((prev) => {
        if (!prev) return prev;
        return { ...prev, type: newType };
      });

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
      const typeChanged = roomDetail?.type !== initialRoomRef.current?.type;

      if (!initialRoom) {
        goBack();
        return;
      }

      if (!hasChanges && !typeChanged) {
        goBack();
        return;
      }

      setLoading(true);

      const compacted = await compactDraft();

      if (!hasChanges && typeChanged) {
        const draftToSave: Draft = compacted ?? {
          roomId: roomId!,
          patches: [],
          lastEdited: new Date().toISOString(),
        };

        await service.saveRoom(
          roomDetail!,
          draftToSave,
          initialType ?? "private"
        );
      }

      if (compacted) {
        const appliedRoom = DraftManager.applyDraft(initialRoom, compacted);
        await service.saveRoom(
          appliedRoom,
          compacted,
          initialType ?? "private"
        );
      }

      goBack();
    } catch (err) {
      console.error("Save room failed:", err);
      goBack();
    } finally {
      setLoading(false);
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
    fetchAndSetRoom,

    // Setting
    isSettingOpen,
    openSetting,
    closeSetting,
    handleSaveSetting,
  };
};
