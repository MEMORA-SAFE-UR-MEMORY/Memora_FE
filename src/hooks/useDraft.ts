import { DraftManager } from "@src/services/draftService";
import { Draft, RoomDetail } from "@src/types/room";
import { useCallback, useEffect, useState } from "react";

export const useDraft = (roomId: number) => {
  const [draft, setDraft] = useState<Draft | null>(null);

  // load draft từ DraftManager khi init
  useEffect(() => {
    const load = async () => {
      const d = await DraftManager.loadDraft(roomId);
      if (d) setDraft(d);
    };
    load();
  }, [roomId]);

  // save patch
  const savePatch = useCallback(
    async (patch: any) => {
      await DraftManager.savePatch(roomId, patch);
      const updated = await DraftManager.loadDraft(roomId);
      setDraft(updated);
    },
    [roomId]
  );

  // clear draft
  const clearDraft = useCallback(async () => {
    await DraftManager.clearDraft(roomId);
    setDraft(null);
  }, [roomId]);

  // applyTo 
  const applyTo = useCallback(
    (room: RoomDetail) => {
      if (!draft) return room;
      return DraftManager.applyDraft(room, draft);
    },
    [draft]
  );

  return {
    draft,
    savePatch,
    clearDraft,
    applyTo,
  };
};
