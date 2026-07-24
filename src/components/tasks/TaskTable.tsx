import type { Task } from "../../types";
import { TaskRow } from "./TaskRow";

interface TaskTableProps {
  tasks: Task[];
  onDelete: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
}

export function TaskTable({ tasks, onDelete, onStatusChange }: TaskTableProps) {
  if (tasks.length === 0) {
    return <div className="empty-state">Tidak ada tugas ditemukan</div>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Tanggal Pengumpulan</th>
          <th>Nama Tugas</th>
          <th>Keterangan</th>
          <th>Status</th>
          <th>Prioritas</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </tbody>
    </table>
  );
}
