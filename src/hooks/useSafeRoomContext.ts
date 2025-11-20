import { RoomContext } from "@src/context/RoomContext";
import { useContext } from "react";

export const useSafeRoomContext = () => {
  try {
    const ctx = useContext(RoomContext);
    return ctx; // Nếu có provider → return ctx bình thường
  } catch (err) {
    return null; // Nếu không có provider → return null
  }
};
