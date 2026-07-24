import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { SmartDateInput } from "../components/tasks/SmartDateInput";
import { TopMenu } from "../components/layout/TopMenu";
import type { Priority, RecurrenceType } from "../types";
import {
  getRecurrenceTypeLabel,
  generateRecurrenceDescription,
} from "../lib/recurrence";

export function TaskEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { tasks, fetchTasks, updateTask } = useTasks();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState<Priority>("Sedang");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] =
    useState<RecurrenceType>("daily");
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceDayOfWeek, setRecurrenceDayOfWeek] = useState<number | null>(
    null
  );
  const [recurrenceDayOfMonth, setRecurrenceDayOfMonth] = useState<
    number | null
  >(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  useEffect(() => {
    if (tasks.length === 0) {
      fetchTasks();
    }
  }, [tasks.length, fetchTasks]);

  useEffect(() => {
    const taskId = Number(id);
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setName(task.name);
      setDescription(task.description);
      setDate(task.date);
      setPriority(task.priority);
      setIsRecurring(task.is_recurring);
      setRecurrenceType(task.recurrence_type ?? "daily");
      setRecurrenceInterval(task.recurrence_interval);
      setRecurrenceDayOfWeek(task.recurrence_day_of_week);
      setRecurrenceDayOfMonth(task.recurrence_day_of_month);
    }
  }, [id, tasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date || !id) return;

    setSaving(true);
    setError(null);
    try {
      await updateTask(Number(id), {
        name: name.trim(),
        description: description.trim(),
        date,
        priority,
        is_recurring: isRecurring,
        recurrence_type: isRecurring ? recurrenceType : null,
        recurrence_day_of_week: isRecurring ? recurrenceDayOfWeek : null,
        recurrence_day_of_month: isRecurring ? recurrenceDayOfMonth : null,
        recurrence_interval: isRecurring ? recurrenceInterval : 1,
      });
      navigate("/tasks");
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <TopMenu title="Edit Tugas" />
      <div className="app-content">
        <div className="form-page-container">
          <h2 style={{ marginBottom: 24 }}>Edit Tugas</h2>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nama Tugas</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama tugas"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tanggal Pengumpulan Tugas</label>
              <SmartDateInput value={date} onChange={setDate} />
            </div>

            <div className="form-group">
              <label className="form-label">Keterangan</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Masukkan keterangan tugas"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>

            <div className="form-group">
              <div className="switch-container">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                  />
                  <span className="switch-slider" />
                </label>
                <span className="form-label">Jadikan tugas berulang</span>
              </div>
            </div>

            {isRecurring && (
              <div
                style={{
                  padding: 16,
                  backgroundColor: "var(--bg-primary)",
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              >
                <div className="form-group">
                  <label className="form-label">Tipe Pengulangan</label>
                  <select
                    value={recurrenceType}
                    onChange={(e) =>
                      setRecurrenceType(e.target.value as RecurrenceType)
                    }
                  >
                    <option value="daily">
                      {getRecurrenceTypeLabel("daily")}
                    </option>
                    <option value="weekly">
                      {getRecurrenceTypeLabel("weekly")}
                    </option>
                    <option value="monthly">
                      {getRecurrenceTypeLabel("monthly")}
                    </option>
                    <option value="custom">
                      {getRecurrenceTypeLabel("custom")}
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Interval</label>
                  <input
                    type="number"
                    min={1}
                    value={recurrenceInterval}
                    onChange={(e) =>
                      setRecurrenceInterval(Number(e.target.value))
                    }
                  />
                </div>

                {recurrenceType === "weekly" && (
                  <div className="form-group">
                    <label className="form-label">Hari</label>
                    <select
                      value={recurrenceDayOfWeek ?? ""}
                      onChange={(e) =>
                        setRecurrenceDayOfWeek(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                    >
                      <option value="">Pilih hari</option>
                      {dayNames.map((day, index) => (
                        <option key={index} value={index}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {recurrenceType === "monthly" && (
                  <div className="form-group">
                    <label className="form-label">Tanggal (1-31)</label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={recurrenceDayOfMonth ?? ""}
                      onChange={(e) =>
                        setRecurrenceDayOfMonth(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      placeholder="Masukkan tanggal (1-31)"
                    />
                  </div>
                )}

                <div style={{ fontSize: 13, opacity: 0.7 }}>
                  {generateRecurrenceDescription({
                    type: recurrenceType,
                    interval: recurrenceInterval,
                    day_of_week: recurrenceDayOfWeek,
                    day_of_month: recurrenceDayOfMonth,
                  })}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn"
                onClick={() => navigate("/tasks")}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || !name.trim() || !date}
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
