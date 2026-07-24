import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TopMenu } from "../components/layout/TopMenu";
import * as api from "../lib/api";
import type { PhaseFormData } from "../types";

export function PhaseFormPage() {
  const navigate = useNavigate();
  const { projectId, phaseId } = useParams<{
    projectId: string;
    phaseId: string;
  }>();
  const isEdit = !!phaseId;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phaseOrder, setPhaseOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && phaseId) {
      setLoading(true);
      api.getPhasesByProject(Number(projectId))
        .then((phases) => {
          const phase = phases.find((p) => p.id === Number(phaseId));
          if (phase) {
            setName(phase.name);
            setDescription(phase.description);
            setPhaseOrder(phase.phase_order);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(String(err));
          setLoading(false);
        });
    }
  }, [isEdit, phaseId, projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const data: PhaseFormData = {
        project_id: Number(projectId),
        name: name.trim(),
        description: description.trim(),
        phase_order: phaseOrder,
      };

      if (isEdit && phaseId) {
        await api.updatePhase(Number(phaseId), data);
      } else {
        await api.createPhase(data);
      }
      navigate(`/thesis`);
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <TopMenu title={isEdit ? "Edit Phase" : "Tambah Phase"} />
        <div className="app-content">
          <div className="empty-state">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopMenu title={isEdit ? "Edit Phase" : "Tambah Phase"} />
      <div className="app-content">
        <div className="form-page-container">
          <h2 style={{ marginBottom: 24 }}>
            {isEdit ? "Edit Phase" : "Tambah Phase Baru"}
          </h2>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nama Phase</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama phase"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deskripsi</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Masukkan deskripsi phase"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Urutan Phase</label>
              <input
                type="number"
                min={0}
                value={phaseOrder}
                onChange={(e) => setPhaseOrder(Number(e.target.value))}
              />
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
                {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Phase"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
