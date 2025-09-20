import { useState } from "react";

export const useCalendar = (initialDate = "") => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const openCalendar = () => setIsCalendarOpen(true);
  const closeCalendar = () => setIsCalendarOpen(false);
  const selectDate = (date: string) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  return {
    isCalendarOpen,
    selectedDate,
    openCalendar,
    closeCalendar,
    selectDate,
  };
};
