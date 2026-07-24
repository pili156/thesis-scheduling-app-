import { useState, useEffect } from "react";
import * as api from "../../lib/api";
import { updateSubtaskStatus } from "../../lib/api";
import type { Subtask } from "../../types";

interface SubtaskWithContext {
  projectName: string;
  phaseName: string;
  subtask: Subtask;
}

export function SubtaskTable() {
  const [rows, setRows] = useState<SubtaskWithContext[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const withDetails = await api.getAllProjectsWithDetails();

        const result: SubtaskWithContext[] = [];
        for (const project of withDetails) {
          for (const phase of project.phases) {
            for (const subtask of phase.subtasks) {
              result.push({
                projectName: project.name,
                phaseName: phase.name,
                subtask,
              });
            }
          }
        }
        setRows(result);
      } catch (error) {
        console.error("Gagal memuat subtask:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Selesai" ? "Belum" : "Selesai";
    try {
      await updateSubtaskStatus(id, newStatus);
      setRows((prev) =>
        prev.map((r) =>
          r.subtask.id === id
            ? { ...r, subtask: { ...r.subtask, status: newStatus } }
            : r
        )
      );
    } catch (error) {
      console.error("Error updating subtask status:", error);
    }
  };

  if (loading) {
    return <div className="empty-state">Memuat data...</div>;
  }

  if (rows.length === 0) {
    return (
      <div className="empty-state" style={{ marginTop: 0 }}>
        Belum ada subtask dari project tugas akhir
      </div>
    );
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Project</th>
          <th>Phase</th>
          <th>Subtask</th>
          <th>Status</th>
          <th>Prioritas</th>
          <th>Tanggal Pengumpulan</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.subtask.id}>
            <td>{row.projectName}</td>
            <td>{row.phaseName}</td>
            <td>{row.subtask.name}</td>
            <td>
              <button
                className={`badge badge-${row.subtask.status.toLowerCase()}`}
                onClick={() => handleStatusToggle(row.subtask.id, row.subtask.status)}
                style={{ cursor: "pointer", border: "none" }}
                title="Klik untuk mengubah status"
              >
                {row.subtask.status}
              </button>
            </td>
            <td>
              {row.subtask.priority && (
                <span
                  className={`badge badge-${row.subtask.priority.toLowerCase()}`}
                >
                  {row.subtask.priority}
                </span>
              )}
            </td>
            <td>
              {row.subtask.due_date || "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
