import { useCallback, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Calendar, CalendarProps, DateData } from "react-native-calendars";

type Props = {
  onSelectDate: (date: string) => void;
  onClose: () => void;
  initialDate?: string;
};

const ModalCalendar = ({ onSelectDate, onClose, initialDate }: Props) => {
  const { width, height } = useWindowDimensions();
  const [selected, setSelected] = useState(initialDate || "");
  const [rowCount, setRowCount] = useState<number>(5);

  const onDayPress = useCallback((day: DateData) => {
    setSelected(day.dateString);
  }, []);

  const marked = useMemo(
    () => ({
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: "#E9D8FF",
        selectedTextColor: "#5C4D90",
        marked: true,
      },
    }),
    [selected]
  );

  const handleClose = useCallback(() => {
    if (selected) {
      onSelectDate(selected);
    }
    onClose();
  }, [selected, onSelectDate, onClose]);

  const theme: CalendarProps["theme"] = {
    backgroundColor: "#ffffff",
    calendarBackground: "#ffffff",
    textSectionTitleColor: "#5C4D90",
    selectedDayBackgroundColor: "#E9D8FF",
    selectedDayTextColor: "#5C4D90",
    todayTextColor: "#EC4F9D",
    textDisabledColor: "#d9e1e8",
    arrowColor: "#5C4D90",
    textDayFontFamily: "Baloo2_medium",
    textMonthFontFamily: "Baloo2_semiBold",
    textDayHeaderFontFamily: "Baloo2_medium",
    textDayFontSize: 12,
    textMonthFontSize: 13,
    textDayHeaderFontSize: 11,
    dayTextColor: "#2d4150",
    monthTextColor: "#5C4D90",
  };

  const containerWidth = width * 0.3;
  const containerHeight = height * 0.75;

  // Tính số hàng
  const getMonthRowCount = (
    year: number,
    month0Based: number,
    firstDayOfWeek = 1
  ): number => {
    const firstDayOfMonth = new Date(year, month0Based, 1).getDay();
    const leadingEmpty = (firstDayOfMonth - firstDayOfWeek + 7) % 7;
    const daysInMonth = new Date(year, month0Based + 1, 0).getDate();
    const totalCells = leadingEmpty + daysInMonth;
    return Math.ceil(totalCells / 7); // 4, 5, hoặc 6
  };

  useEffect(() => {
    const today = new Date();
    const rows = getMonthRowCount(today.getFullYear(), today.getMonth(), 1);
    setRowCount(rows);
  }, []);

  // Style phụ thuộc vào rowCount
  const calendarStyles = useMemo(() => {
    switch (rowCount) {
      case 4:
        return {
          scaleY: 1.0,
          calendarMarginTop: 9,
          buttonMarginTop: 0,
        };
      case 5:
        return {
          scaleY: 0.9,
          calendarMarginTop: -9,
          buttonMarginTop: -9,
        };
      case 6:
        return {
          scaleY: 0.8,
          calendarMarginTop: -32,
          buttonMarginTop: -15,
        };
      default:
        return {
          scaleY: 0.9,
          calendarMarginTop: -9,
          buttonMarginTop: -9,
        };
    }
  }, [rowCount]);

  return (
    <View
      style={[
        styles.container,
        { width: containerWidth, height: containerHeight },
      ]}
    >
      <View style={{ transform: [{ scaleY: calendarStyles.scaleY }] }}>
        <Calendar
          enableSwipeMonths
          onDayPress={onDayPress}
          markedDates={marked}
          theme={theme}
          style={{
            width: "100%",
            marginTop: calendarStyles.calendarMarginTop,
          }}
          hideExtraDays={true}
          showWeekNumbers={false}
          firstDay={1}
          hideArrows={false}
          disableMonthChange={false}
          monthFormat={"MMMM yyyy"}
          onMonthChange={(month) => {
            const rows = getMonthRowCount(month.year, month.month - 1, 1);
            setRowCount(rows);
          }}
        />
        <TouchableOpacity
          style={[
            styles.closeButton,
            { marginTop: calendarStyles.buttonMarginTop },
          ]}
          onPress={handleClose}
        >
          <Text style={styles.closeButtonText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  closeButton: {
    backgroundColor: "#B1E1FF",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignItems: "center",
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#333333",
    fontFamily: "Baloo2_medium",
    fontSize: 12,
  },
});

export default ModalCalendar;
