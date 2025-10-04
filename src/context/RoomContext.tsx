import { createContext, useContext } from "react";

type RoomContextType = {
  roomId: number;
  themeId: number;
  type: "private" | "public";
  mode?: "view" | "edit";
  back: string;
};

const RoomContext = createContext<RoomContextType | null>(null);

export const RoomProvider = ({
  children,
  roomId,
  themeId,
  type,
  mode,
  back,
}: RoomContextType & { children: React.ReactNode }) => {
  return (
    <RoomContext.Provider value={{ roomId, themeId, type, mode, back }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoomContext must be used within RoomProvider");
  return ctx;
};
