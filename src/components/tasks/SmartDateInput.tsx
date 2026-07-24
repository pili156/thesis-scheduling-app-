import { useState, useRef, useEffect, lazy, Suspense } from "react";
import "react-day-picker/style.css";
import { parseNaturalDate, formatDate } from "../../lib/dateParser";

const DayPicker = lazy(() => import("react-day-picker").then(m => ({ default: m.DayPicker })));

interface SmartDateInputProps {
  value: string;
  onChange: (date: string) => void;
}

export function SmartDateInput({ value, onChange }: SmartDateInputProps) {
  const [textValue, setTextValue] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleTextChange = (text: string) => {
    setTextValue(text);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      parseNaturalDate(text).then((parsed) => {
        if (parsed) {
          setSelectedDate(parsed);
          onChange(formatDate(parsed));
        }
      });
    }, 300);
  };

  const handleDaySelect = (day: Date | undefined) => {
    if (day) {
      setSelectedDate(day);
      onChange(formatDate(day));
      setTextValue(
        day.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
      setShowCalendar(false);
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Contoh : Rabu, 1 Juli 2026"
        value={textValue}
        onChange={(e) => handleTextChange(e.target.value)}
        onFocus={() => setShowCalendar(true)}
        style={{ width: "100%" }}
      />
      {showCalendar && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 50,
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 8,
            padding: 8,
          }}
        >
          <Suspense fallback={<div style={{ padding: 16, textAlign: "center" }}>Memuat kalender...</div>}>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDaySelect}
              defaultMonth={selectedDate}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
