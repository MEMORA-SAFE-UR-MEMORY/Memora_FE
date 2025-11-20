import { createContext, useContext, useState } from "react";

type RoomContextType = {
  roomId: number;
  themeId: number;
  type: "private" | "public";
  mode?: "view" | "edit";
  viewType?: "random" | "list";
  back: string;
  setRoomContext: (
    newValues: Partial<Omit<RoomContextType, "setRoomContext">>
  ) => void;
};

const RoomContext = createContext<RoomContextType | null>(null);

export const RoomProvider = ({
  children,
  roomId,
  themeId,
  type,
  mode = "edit",
  viewType,
  back,
}: Omit<RoomContextType, "setRoomContext"> & { children: React.ReactNode }) => {
  const [contextValue, setContextValue] = useState<
    Omit<RoomContextType, "setRoomContext">
  >({
    roomId,
    themeId,
    type,
    mode,
    viewType,
    back,
  });

  const setRoomContext = (
    newValues: Partial<Omit<RoomContextType, "setRoomContext">>
  ) => {
    setContextValue((prev) => ({ ...prev, ...newValues }));
  };

  return (
    <RoomContext.Provider value={{ ...contextValue, setRoomContext }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoomContext must be used within RoomProvider");
  return ctx;
};
