import { useState } from "react";

export type Door = {
  id: string;
  color: string;
  image: any;
  name: string;
  theme: string;
};

export function useDoors(initialDoors: Door[] = []) {
  const [doors, setDoors] = useState<Door[]>(initialDoors);

  const addDoor = (door: Door) => {
    setDoors((prev) => [...prev, door]);
  };

  return { doors, addDoor };
}
