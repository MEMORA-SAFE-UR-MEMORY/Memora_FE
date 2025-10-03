import { useDraft } from "@src/hooks/useDraft";
import { Draft, RoomDetail } from "@src/types/room";
import React, { createContext, useContext } from "react";

type RoomDraftContextValue = {
  draft: any;
  applyTo: (room: RoomDetail) => RoomDetail;
  savePatch: (patch: any) => Promise<void>;
  clearDraft: () => Promise<void>;
  compactDraft: () => Promise<Draft | null>;
};

const RoomDraftContext = createContext<RoomDraftContextValue | null>(null);

export const RoomDraftProvider = ({ roomId, children }: any) => {
  const draftApi = useDraft(roomId);
  return (
    <RoomDraftContext.Provider value={draftApi}>
      {children}
    </RoomDraftContext.Provider>
  );
};

export const useRoomDraftContext = () => {
  const ctx = useContext(RoomDraftContext);
  if (!ctx) throw new Error("useRoomDraftContext must be inside provider");
  return ctx;
};
