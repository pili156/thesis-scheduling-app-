import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { TaskTable } from "../components/tasks/TaskTable";
import { SearchFilterBar } from "../components/tasks/SearchFilterBar";
import { TopMenu } from "../components/layout/TopMenu";

export function TaskListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    filters,
    loading,
    fetchTasks,
    deleteTask,
    updateTaskStatus,
    setFilters,
    getFilteredTasks,
  } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      setFilters({ search: "" });
    }
  }, [searchParams, setFilters]);

  const filteredTasks = getFilteredTasks();

  const handleDelete = async (id: number) => {
    if (window.confirm("Yakin ingin menghapus tugas ini?")) {
      try {
        await deleteTask(id);
      } catch (err) {
        alert("Gagal menghapus tugas: " + String(err));
      }
    }
  };

  return (
    <div>
      <TopMenu title="List Tugas" />
      <div className="app-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2>Daftar Tugas</h2>
          <button
            className="btn btn-primary btn-add"
            onClick={() => navigate("/tasks/new")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Tugas
          </button>
        </div>

        <SearchFilterBar
          search={filters.search}
          status={filters.status}
          priority={filters.priority}
          showRecurring={filters.showRecurring}
          onSearchChange={(search) => setFilters({ search })}
          onStatusChange={(status) => setFilters({ status })}
          onPriorityChange={(priority) => setFilters({ priority })}
          onShowRecurringChange={(showRecurring) => setFilters({ showRecurring })}
        />

        {loading ? (
          <div className="empty-state">Memuat data...</div>
        ) : (
          <TaskTable
            tasks={filteredTasks}
            onDelete={handleDelete}
            onStatusChange={updateTaskStatus}
          />
        )}
      </div>
    </div>
  );
}
