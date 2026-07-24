import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Task } from "../../types";
import { PriorityBadge } from "./PriorityBadge";
import { formatDisplayDate } from "../../lib/dateParser";
import { getRecurringDescription } from "../../hooks/useRecurringTasks";

interface TaskRowProps {
  task: Task;
  onDelete: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
}

export const TaskRow = memo(function TaskRow({ task, onDelete, onStatusChange }: TaskRowProps) {
  const navigate = useNavigate();
  const recurringDesc = getRecurringDescription(task);

  const statusClass = `badge-${task.status.toLowerCase()}`;

  const handleStatusToggle = () => {
    const newStatus = task.status === "Selesai" ? "Belum" : "Selesai";
    onStatusChange?.(task.id, newStatus);
  };

  return (
    <tr>
      <td>{formatDisplayDate(task.date)}</td>
      <td>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {task.name}
          {task.is_recurring && (
            <span className="recurring-icon" title={recurringDesc ?? ""}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </span>
          )}
        </span>
      </td>
      <td>{task.description}</td>
      <td>
        <button
          className={`badge ${statusClass}`}
          onClick={handleStatusToggle}
          style={{ cursor: "pointer", border: "none" }}
          title="Klik untuk mengubah status"
        >
          {task.status}
        </button>
      </td>
      <td>
        <PriorityBadge priority={task.priority} />
      </td>
      <td>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn-icon"
            onClick={() => navigate(`/tasks/${task.id}/edit`)}
            title="Edit"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="btn-icon"
            onClick={() => onDelete(task.id)}
            title="Hapus"
            style={{ color: "var(--status-terlewat)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
});
