import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TopMenu } from "../components/layout/TopMenu";
import { SmartDateInput } from "../components/tasks/SmartDateInput";
import * as api from "../lib/api";
import type { SubtaskFormData, Priority } from "../types";

export function SubtaskFormPage() {
  const navigate = useNavigate();
  const { phaseId, subtaskId } = useParams<{
    projectId: string;
    phaseId: string;
    subtaskId: string;
  }>();
  const isEdit = !!subtaskId;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Sedang");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && subtaskId && phaseId) {
      setLoading(true);
      api.getSubtasksByPhase(Number(phaseId))
        .then((subtasks) => {
          const subtask = subtasks.find((s) => s.id === Number(subtaskId));
          if (subtask) {
            setName(subtask.name);
            setDescription(subtask.description);
            setPriority(subtask.priority);
            setDueDate(subtask.due_date ?? "");
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(String(err));
          setLoading(false);
        });
    }
  }, [isEdit, subtaskId, phaseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const data: SubtaskFormData = {
        phase_id: Number(phaseId),
        name: name.trim(),
        description: description.trim(),
        priority,
        estimated_days: null,
        actual_days: null,
        due_date: dueDate || null,
      };

      if (isEdit && subtaskId) {
        await api.updateSubtask(Number(subtaskId), data);
      } else {
        await api.createSubtask(data);
      }
      navigate("/thesis");
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <TopMenu title={isEdit ? "Edit Subtask" : "Tambah Subtask"} />
        <div className="app-content">
          <div className="empty-state">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopMenu title={isEdit ? "Edit Subtask" : "Tambah Subtask"} />
      <div className="app-content">
        <div className="form-page-container">
          <h2 style={{ marginBottom: 24 }}>
            {isEdit ? "Edit Subtask" : "Tambah Subtask Baru"}
          </h2>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nama Subtask</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama subtask"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deskripsi</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Masukkan deskripsi subtask"
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
              <label className="form-label">Tanggal Pengumpulan Tugas</label>
              <SmartDateInput value={dueDate} onChange={setDueDate} />
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn"
                onClick={() => navigate("/thesis")}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || !name.trim()}
              >
                {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Subtask"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
