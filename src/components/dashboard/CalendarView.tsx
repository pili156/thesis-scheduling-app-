import { useState, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Task } from "../../types";
import { formatDate } from "../../lib/dateParser";

interface CalendarViewProps {
  tasks: Task[];
}

export const CalendarView = memo(function CalendarView({ tasks }: CalendarViewProps) {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonth = useCallback(() => setCurrentDate(new Date(year, month - 1, 1)), [year, month]);
  const nextMonth = useCallback(() => setCurrentDate(new Date(year, month + 1, 1)), [year, month]);

  const taskDates = useMemo(() => new Set(tasks.map((t) => t.date.split("T")[0])), [tasks]);

  const handleDateClick = useCallback((day: number) => {
    const dateStr = formatDate(new Date(year, month, day));
    navigate(`/tasks?date=${dateStr}`);
  }, [year, month, navigate]);

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button className="btn-icon" onClick={prevMonth}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h3 style={{ textAlign: "center", margin: 0 }}>
          {currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
        </h3>
        <button className="btn-icon" onClick={nextMonth}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className="calendar-grid">
        {dayNames.map((day) => (
          <div
            key={day}
            style={{
              textAlign: "center",
              fontWeight: 600,
              color: "var(--border-color)",
              padding: 8,
            }}
          >
            {day}
          </div>
        ))}
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDate(new Date(year, month, day));
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const hasTasks = taskDates.has(dateStr);

          return (
            <div
              key={day}
              className={`calendar-day${isToday ? " today" : ""}${hasTasks ? " has-tasks" : ""}`}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
});
