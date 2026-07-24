import { memo } from "react";
import type { TaskStatus, Priority } from "../../types";

interface SearchFilterBarProps {
  search: string;
  status: TaskStatus | "Semua";
  priority: Priority | "Semua";
  showRecurring: "Semua" | "Berulang" | "Biasa";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | "Semua") => void;
  onPriorityChange: (value: Priority | "Semua") => void;
  onShowRecurringChange: (value: "Semua" | "Berulang" | "Biasa") => void;
}

export const SearchFilterBar = memo(function SearchFilterBar({
  search,
  status,
  priority,
  showRecurring,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onShowRecurringChange,
}: SearchFilterBarProps) {
  return (
    <div className="search-filter-bar">
      <input
        type="text"
        placeholder="Cari tugas..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        value={status}
        onChange={(e) =>
          onStatusChange(e.target.value as TaskStatus | "Semua")
        }
      >
        <option value="Semua">Semua Status</option>
        <option value="Belum">Belum</option>
        <option value="Selesai">Selesai</option>
        <option value="Terlewat">Terlewat</option>
      </select>
      <select
        value={priority}
        onChange={(e) =>
          onPriorityChange(e.target.value as Priority | "Semua")
        }
      >
        <option value="Semua">Semua Prioritas</option>
        <option value="Tinggi">Tinggi</option>
        <option value="Sedang">Sedang</option>
        <option value="Rendah">Rendah</option>
      </select>
      <div style={{ display: "flex", gap: 4 }}>
        {(["Semua", "Biasa", "Berulang"] as const).map((option) => (
          <button
            key={option}
            className={`btn ${showRecurring === option ? "btn-primary" : ""}`}
            style={{ padding: "6px 12px", fontSize: 12 }}
            onClick={() => onShowRecurringChange(option)}
          >
            {option === "Semua" ? "Semua" : option === "Biasa" ? "Tugas Biasa" : "Tugas Berulang"}
          </button>
        ))}
      </div>
    </div>
  );
});
