import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { CalendarView } from "../components/dashboard/CalendarView";
import { SummaryCards } from "../components/dashboard/SummaryCards";
import { SubtaskTable } from "../components/dashboard/SubtaskTable";
import { TaskTable } from "../components/tasks/TaskTable";
import { TopMenu } from "../components/layout/TopMenu";

export function DashboardPage() {
  const navigate = useNavigate();
  const { tasks, error, refreshOverdueTasks, deleteTask, updateTaskStatus, loading } = useTasks();

  useEffect(() => {
    refreshOverdueTasks();
  }, [refreshOverdueTasks]);

  const handleTaskDelete = async (id: number) => {
    await deleteTask(id);
  };

  const handleTaskStatusChange = async (id: number, status: string) => {
    await updateTaskStatus(id, status);
  };

  if (loading) {
    return (
      <div>
        <TopMenu title="Dashboard" />
        <div className="app-content">
          <div className="empty-state">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopMenu title="Dashboard" />
      <div className="app-content">
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}
        <SummaryCards tasks={tasks} />
        <CalendarView tasks={tasks} />

        <div className="card" style={{ marginTop: 24 }}>
          <h3
            style={{ marginBottom: 16, textAlign: "center", cursor: "pointer" }}
            onClick={() => navigate("/tasks")}
          >
            Daftar Tugas
          </h3>
          <TaskTable
            tasks={tasks}
            onDelete={handleTaskDelete}
            onStatusChange={handleTaskStatusChange}
          />
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <h3
            style={{ marginBottom: 16, textAlign: "center", cursor: "pointer" }}
            onClick={() => navigate("/thesis")}
          >
            Tugas Dari Tugas Akhir
          </h3>
          <SubtaskTable />
        </div>
      </div>
    </div>
  );
}
