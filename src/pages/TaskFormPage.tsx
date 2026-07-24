import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { SmartDateInput } from "../components/tasks/SmartDateInput";
import { TopMenu } from "../components/layout/TopMenu";
import type { Priority } from "../types";

export function TaskFormPage() {
  const navigate = useNavigate();
  const { addTask } = useTasks();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState<Priority>("Sedang");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;

    setSaving(true);
    setError(null);
    try {
      await addTask({
        name: name.trim(),
        description: description.trim(),
        date,
        priority,
        is_recurring: isRecurring,
        recurrence_type: isRecurring ? "daily" : null,
        recurrence_day_of_week: null,
        recurrence_day_of_month: null,
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
      <TopMenu title="Tambah Tugas" />
      <div className="app-content">
        <div className="form-page-container">
          <h2 style={{ marginBottom: 8 }}>Tambah Tugas Baru</h2>

          <div className="form-group" style={{ marginBottom: 16 }}>
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
              <label className="form-label">
                {isRecurring ? "Tanggal Pengumpulan Pertama" : "Tanggal Pengumpulan Tugas"}
              </label>
              <SmartDateInput value={date} onChange={setDate} />
            </div>

            {isRecurring && (
              <div className="form-group">
                <label className="form-label">Interval Perulangan (hari)</label>
                <input
                  type="number"
                  min={1}
                  value={recurrenceInterval}
                  onChange={(e) =>
                    setRecurrenceInterval(Number(e.target.value))
                  }
                  placeholder="Masukkan interval dalam hari"
                />
              </div>
            )}

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
                {saving ? "Menyimpan..." : "Tambah Tugas"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
