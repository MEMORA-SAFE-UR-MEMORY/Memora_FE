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
  draft?: Draft
) => {
  const { themes } = useThemeContext();
  const { compactDraft } = useDraft(roomId!);
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // load once từ props
  useEffect(() => {
    if (!roomId || !themeId) return;

    const theme = themes.find((t) => t.id === themeId);
    if (!theme) {
      setError("Theme not found");
      setLoading(false);
      return;
    }

    const detail: RoomDetail = {
      id: roomId,
      themeId,
      roomName: "", // nếu cần thì thêm sau
      userId: "", // nếu cần thì thêm sau
      doorId: "",
      type: initialType ?? "private",
      createdAt: new Date().toISOString(),
      theme,
      items: [],
    };

    setRoomDetail(detail);
    setLoading(false);
  }, [roomId, themeId, initialType, themes]);

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

  const toggleType = useCallback(async () => {
    if (!roomDetail) return;
    const newType = roomDetail.type === "private" ? "public" : "private";
    return updateType(newType);
  }, [roomDetail, updateType]);

  const exitToHall = async (hasChanges?: boolean) => {
    try {
      if (!initialRoom || !draft) {
        router.replace("/hall");
        return;
      }

      if (!hasChanges) {
        // User chỉ xem room, không chỉnh sửa
        router.replace("/hall");
        return;
      }

      // Nếu có chỉnh sửa thì mới gọi save
      const compacted = compactDraft();
      if (compacted) {
        console.log("compated", compacted);
        const appliedRoom = DraftManager.applyDraft(initialRoom, compacted);
        await service.saveRoom(appliedRoom, compacted);
      }
      router.replace("/hall");
    } catch (err) {
      console.error("Save room failed:", err);
      router.replace("/hall");
    }
  };

  return {
    roomDetail,
    loading,
    error,
    updating,
    updateType,
    toggleType,
    exitToHall,
  };
};
