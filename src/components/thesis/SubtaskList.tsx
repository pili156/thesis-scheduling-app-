import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Subtask } from "../../types";
import { getDaysUntil } from "../../lib/dateParser";
import { deleteSubtask, updateSubtaskStatus } from "../../lib/api";

interface SubtaskListProps {
  subtasks: Subtask[];
  projectId?: number;
  phaseId?: number;
  onSubtaskUpdate?: (id: number, status: string) => void;
  onDeleteSubtask?: (id: number) => void;
}

export const SubtaskList = memo(function SubtaskList({
  subtasks,
  projectId,
  phaseId,
  onSubtaskUpdate,
  onDeleteSubtask,
}: SubtaskListProps) {
  const navigate = useNavigate();

  if (subtasks.length === 0) {
    return <div style={{ padding: 12, opacity: 0.6 }}>Belum ada subtask</div>;
  }

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Yakin ingin menghapus subtask "${name}"?`)) {
      try {
        await deleteSubtask(id);
        onDeleteSubtask?.(id);
      } catch (error) {
        console.error("Error deleting subtask:", error);
      }
    }
  };

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Selesai" ? "Belum" : "Selesai";
    try {
      await updateSubtaskStatus(id, newStatus);
      onSubtaskUpdate?.(id, newStatus);
    } catch (error) {
      console.error("Error updating subtask status:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {subtasks.map((subtask) => {
        const daysUntil = subtask.due_date ? getDaysUntil(subtask.due_date) : null;
        const statusClass = `badge-${subtask.status.toLowerCase()}`;

        return (
          <div
            key={subtask.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              backgroundColor: "var(--bg-primary)",
              borderRadius: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  textDecoration:
                    subtask.status === "Selesai" ? "line-through" : "none",
                  opacity: subtask.status === "Selesai" ? 0.6 : 1,
                }}
              >
                {subtask.name}
              </span>
              {subtask.priority && (
                <span className={`badge badge-${subtask.priority.toLowerCase()}`} style={{ fontSize: 10 }}>
                  {subtask.priority}
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {subtask.due_date && (
                <span style={{ fontSize: 12, opacity: 0.7 }}>
                  {subtask.due_date}
                </span>
              )}
              {daysUntil !== null && subtask.status !== "Selesai" && (
                <span style={{ fontSize: 12, opacity: 0.7 }}>
                  {daysUntil > 0
                    ? `${daysUntil} hari lagi`
                    : daysUntil === 0
                    ? "Hari ini"
                    : `Terlewat ${Math.abs(daysUntil)} hari`}
                </span>
              )}
              <button
                className={`badge ${statusClass}`}
                onClick={() => handleStatusToggle(subtask.id, subtask.status)}
                style={{ fontSize: 11, cursor: "pointer", border: "none" }}
                title="Klik untuk mengubah status"
              >
                {subtask.status}
              </button>
              {projectId && phaseId && (
                <>
                  <button
                    className="btn btn-primary btn-add"
                    style={{ padding: "2px 8px", fontSize: 11 }}
                    onClick={() =>
                      navigate(
                        `/thesis/${projectId}/phase/${phaseId}/subtask/${subtask.id}/edit`
                      )
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-add"
                    style={{ padding: "2px 8px", fontSize: 11, color: "#AB0000" }}
                    onClick={() => handleDelete(subtask.id, subtask.name)}
                  >
                    Hapus
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});
