import { createContext, useContext } from "react";

type RoomContextType = {
  roomId: number;
  themeId: number;
  type: "private" | "public";
  mode: "view" | "edit";
};

const RoomContext = createContext<RoomContextType | null>(null);

export const RoomProvider = ({
  children,
  roomId,
  themeId,
  type,
  mode,
}: RoomContextType & { children: React.ReactNode }) => {
  return (
    <RoomContext.Provider value={{ roomId, themeId, type, mode }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoomContext must be used within RoomProvider");
  return ctx;
};
