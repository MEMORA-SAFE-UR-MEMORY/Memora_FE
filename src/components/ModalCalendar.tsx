import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
  Text,
  Modal,
} from "react-native";
import { Calendar, CalendarProps, DateData } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import BtnBorder from "@src/components/BtnBorder";

type Props = {
  onSelectDate: (date: string) => void;
  onClose: () => void;
  initialDate?: string;
};

const ModalCalendar = ({ onSelectDate, onClose, initialDate }: Props) => {
  const { width, height } = useWindowDimensions();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selected, setSelected] = useState(initialDate || "");
  const [rowCount, setRowCount] = useState<number>(5);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const isInitialized = useRef(false);

  const onDayPress = useCallback(
    (day: DateData) => {
      setSelected(day.dateString);
      onSelectDate(day.dateString);
      onClose();
    },
    [onSelectDate, onClose]
  );

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

  const getMonthRowCount = (
    year: number,
    month0Based: number,
    firstDayOfWeek = 1
  ): number => {
    const firstDayOfMonth = new Date(year, month0Based, 1).getDay();
    const leadingEmpty = (firstDayOfMonth - firstDayOfWeek + 7) % 7;
    const daysInMonth = new Date(year, month0Based + 1, 0).getDate();
    const totalCells = leadingEmpty + daysInMonth;
    return Math.ceil(totalCells / 7);
  };

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;

      if (initialDate) {
        const d = new Date(initialDate);
        const newMonth = d.getMonth() + 1;
        const newYear = d.getFullYear();
        setMonth(newMonth);
        setYear(newYear);
        setSelected(initialDate);

        const rows = getMonthRowCount(newYear, d.getMonth(), 1);
        setRowCount(rows);
      } else {
        const today = new Date();
        const rows = getMonthRowCount(today.getFullYear(), today.getMonth(), 1);
        setRowCount(rows);
      }
    }
  }, []);

  const calendarStyles = useMemo(() => {
    switch (rowCount) {
      case 4:
        return { scaleY: 1.0, calendarMarginTop: 9 };
      case 5:
        return { scaleY: 0.9, calendarMarginTop: -9 };
      case 6:
        return { scaleY: 0.8, calendarMarginTop: -32 };
      default:
        return { scaleY: 0.9, calendarMarginTop: -9 };
    }
  }, [rowCount]);

  const currentDateString = `${year}-${month.toString().padStart(2, "0")}-01`;

  const handleMonthChange = (m: any) => {
    if (isInitialized.current) {
      setMonth(m.month);
      setYear(m.year);
      const rows = getMonthRowCount(m.year, m.month - 1, 1);
      setRowCount(rows);
    }
  };

  const handleConfirmMonthYear = () => {
    const rows = getMonthRowCount(year, month - 1, 1);
    setRowCount(rows);
    setShowMonthPicker(false);
  };

  return (
    <View
      style={[
        styles.container,
        { width: containerWidth, height: containerHeight },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.monthPickerButton}
          onPress={() => setShowMonthPicker(true)}
        >
          <Text style={styles.monthPickerText}>{`Tháng ${month}/${year}`}</Text>
        </Pressable>
      </View>

      {/* Custom Month/Year Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
        supportedOrientations={["portrait", "landscape"]}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Chọn tháng & năm</Text>

            <View style={styles.pickerRow}>
              <Picker
                selectedValue={month}
                onValueChange={(m) => setMonth(m)}
                style={{ width: 150, color: "#5C4D90" }}
                dropdownIconColor="#5C4D90"
                itemStyle={{
                  color: "#5C4D90",
                  fontSize: 14,
                  fontFamily: "Baloo2_medium",
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <Picker.Item
                    key={i}
                    label={`Tháng ${i + 1}`}
                    value={i + 1}
                    color="#5C4D90"
                    fontFamily="Baloo2_medium"
                  />
                ))}
              </Picker>

              <Picker
                selectedValue={year}
                onValueChange={(y) => setYear(y)}
                style={{ width: 120, color: "#5C4D90" }}
                dropdownIconColor="#5C4D90"
                itemStyle={{
                  color: "#5C4D90",
                  fontSize: 14,
                  fontFamily: "Baloo2_medium",
                }}
              >
                {(() => {
                  const currentYear = new Date().getFullYear();
                  const startYear = 1800;
                  const yearCount = currentYear - startYear + 1;
                  const years = Array.from(
                    { length: yearCount },
                    (_, i) => startYear + i
                  );

                  return years.map((y) => (
                    <Picker.Item
                      key={y}
                      label={`${y}`}
                      value={y}
                      color="#5C4D90"
                      fontFamily="Baloo2_medium"
                    />
                  ));
                })()}
              </Picker>
            </View>

            <BtnBorder
              text="Xong"
              colorType="purple"
              onPress={handleConfirmMonthYear}
            />
          </View>
        </View>
      </Modal>

      {/* Calendar */}
      <View style={{ transform: [{ scaleY: calendarStyles.scaleY }] }}>
        <Calendar
          key={`${year}-${month}`}
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
          disableMonthChange={false}
          monthFormat={"MMMM yyyy"}
          renderHeader={() => null}
          hideArrows={true}
          current={currentDateString}
          onMonthChange={handleMonthChange}
        />
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
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  monthPickerButton: {
    borderWidth: 1,
    borderColor: "#E9D8FF",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#F8F4FF",
  },
  monthPickerText: {
    fontFamily: "Baloo2_medium",
    color: "#5C4D90",
    fontSize: 12,
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: 290,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    color: "#5C4D90",
    fontFamily: "Baloo2_semiBold",
    marginBottom: 12,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ModalCalendar;
