import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TopMenu } from "../components/layout/TopMenu";
import { SmartDateInput } from "../components/tasks/SmartDateInput";
import { AdvisorFormPopup } from "../components/popups/AdvisorFormPopup";
import { PartnerFormPopup } from "../components/popups/PartnerFormPopup";
import * as api from "../lib/api";
import type { ProjectFormData, Advisor, Partner, SubtaskFormData, Priority } from "../types";

export function ThesisFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [phases, setPhases] = useState<
    { name: string; subtasks: { name: string; due_date: string; priority: string }[] }[]
  >([]);
  const [showAdvisorForm, setShowAdvisorForm] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      api.getProjectWithDetails(Number(id))
        .then((project) => {
          setName(project.name);
          setDescription(project.description);
          setStartDate(project.start_date ?? "");
          setEndDate(project.end_date ?? "");
          setAdvisors(project.advisors);
          setPartners(project.partners);
          setPhases(
            project.phases.map((p) => ({
              name: p.name,
              subtasks: p.subtasks.map((s) => ({
                name: s.name,
                due_date: s.due_date ?? "",
                priority: s.priority,
              })),
            }))
          );
          setLoading(false);
        })
        .catch((err) => {
          setError(String(err));
          setLoading(false);
        });
    }
  }, [isEdit, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const data: ProjectFormData = {
        name: name.trim(),
        description: description.trim(),
        start_date: startDate || null,
        end_date: endDate || null,
      };

      if (isEdit && id) {
        await api.updateProject(Number(id), data);
      } else {
        const project = await api.createProject(data);
        const projectId = project.id;

        const advisorPromises = advisors.map((advisor) =>
          api.addAdvisor({
            project_id: projectId,
            name: advisor.name,
            phone: advisor.phone ?? "",
            email: advisor.email ?? "",
          })
        );

        const partnerPromises = partners.map((partner) =>
          api.addPartner({
            project_id: projectId,
            name: partner.name,
            phone: partner.phone ?? "",
            email: partner.email ?? "",
          })
        );

        await Promise.all([...advisorPromises, ...partnerPromises]);

        for (let i = 0; i < phases.length; i++) {
          const phase = phases[i];
          const createdPhase = await api.createPhase({
            project_id: projectId,
            name: phase.name,
            description: "",
            phase_order: i + 1,
          });

          const subtaskPromises = phase.subtasks.map((subtask) => {
            const subtaskData: SubtaskFormData = {
              phase_id: createdPhase.id,
              name: subtask.name,
              description: "",
              priority: subtask.priority as Priority,
              estimated_days: null,
              actual_days: null,
              due_date: subtask.due_date || null,
            };
            return api.createSubtask(subtaskData);
          });
          await Promise.all(subtaskPromises);
        }
      }
      navigate("/thesis");
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAdvisor = async (data: {
    id?: number;
    project_id: number;
    name: string;
    phone: string;
    email: string;
  }) => {
    try {
      if (editingAdvisor) {
        if (isEdit && id) {
          const saved = await api.updateAdvisor({
            id: editingAdvisor.id,
            project_id: Number(id),
            name: data.name,
            phone: data.phone,
            email: data.email,
          });
          setAdvisors((prev) => prev.map((a) => (a.id === editingAdvisor.id ? saved : a)));
        } else {
          setAdvisors((prev) =>
            prev.map((a) =>
              a.id === editingAdvisor.id
                ? { ...a, name: data.name, phone: data.phone || null, email: data.email || null }
                : a
            )
          );
        }
      } else {
        if (isEdit && id) {
          const saved = await api.addAdvisor(data);
          setAdvisors((prev) => [...prev, saved]);
        } else {
          const temp: Advisor = {
            id: Date.now() + Math.random(),
            project_id: 0,
            name: data.name,
            phone: data.phone || null,
            email: data.email || null,
          };
          setAdvisors((prev) => [...prev, temp]);
        }
      }
      setShowAdvisorForm(false);
      setEditingAdvisor(null);
    } catch (err) {
      setError(String(err));
    }
  };

  const handleDeleteAdvisor = async (advisorId: number) => {
    try {
      if (isEdit && id) {
        await api.deleteAdvisor(advisorId);
      }
      setAdvisors((prev) => prev.filter((a) => a.id !== advisorId));
      setShowAdvisorForm(false);
      setEditingAdvisor(null);
    } catch (err) {
      setError(String(err));
    }
  };

  const handleSavePartner = async (data: {
    id?: number;
    project_id: number;
    name: string;
    phone: string;
    email: string;
  }) => {
    try {
      if (editingPartner) {
        if (isEdit && id) {
          const saved = await api.updatePartner({
            id: editingPartner.id,
            project_id: Number(id),
            name: data.name,
            phone: data.phone,
            email: data.email,
          });
          setPartners((prev) => prev.map((p) => (p.id === editingPartner.id ? saved : p)));
        } else {
          setPartners((prev) =>
            prev.map((p) =>
              p.id === editingPartner.id
                ? { ...p, name: data.name, phone: data.phone || null, email: data.email || null }
                : p
            )
          );
        }
      } else {
        if (isEdit && id) {
          const saved = await api.addPartner(data);
          setPartners((prev) => [...prev, saved]);
        } else {
          const temp: Partner = {
            id: Date.now() + Math.random(),
            project_id: 0,
            name: data.name,
            phone: data.phone || null,
            email: data.email || null,
          };
          setPartners((prev) => [...prev, temp]);
        }
      }
      setShowPartnerForm(false);
      setEditingPartner(null);
    } catch (err) {
      setError(String(err));
    }
  };

  const handleDeletePartner = async (partnerId: number) => {
    try {
      if (isEdit && id) {
        await api.deletePartner(partnerId);
      }
      setPartners((prev) => prev.filter((p) => p.id !== partnerId));
      setShowPartnerForm(false);
      setEditingPartner(null);
    } catch (err) {
      setError(String(err));
    }
  };

  const addPhase = () => {
    setPhases((prev) => [...prev, { name: "", subtasks: [] }]);
  };

  const removePhase = (index: number) => {
    setPhases((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePhaseName = (index: number, name: string) => {
    setPhases((prev) =>
      prev.map((p, i) => (i === index ? { ...p, name } : p))
    );
  };

  const addSubtaskToPhase = (phaseIndex: number) => {
    setPhases((prev) =>
      prev.map((p, i) =>
        i === phaseIndex
          ? { ...p, subtasks: [...p.subtasks, { name: "", due_date: "", priority: "Sedang" }] }
          : p
      )
    );
  };

  const removeSubtaskFromPhase = (phaseIndex: number, subtaskIndex: number) => {
    setPhases((prev) =>
      prev.map((p, i) =>
        i === phaseIndex
          ? { ...p, subtasks: p.subtasks.filter((_, j) => j !== subtaskIndex) }
          : p
      )
    );
  };

  const updateSubtaskName = (
    phaseIndex: number,
    subtaskIndex: number,
    name: string
  ) => {
    setPhases((prev) =>
      prev.map((p, i) =>
        i === phaseIndex
          ? {
              ...p,
              subtasks: p.subtasks.map((s, j) =>
                j === subtaskIndex ? { ...s, name } : s
              ),
            }
          : p
      )
    );
  };

  const updateSubtaskDueDate = (
    phaseIndex: number,
    subtaskIndex: number,
    due_date: string
  ) => {
    setPhases((prev) =>
      prev.map((p, i) =>
        i === phaseIndex
          ? {
              ...p,
              subtasks: p.subtasks.map((s, j) =>
                j === subtaskIndex ? { ...s, due_date } : s
              ),
            }
          : p
      )
    );
  };

  const updateSubtaskPriority = (
    phaseIndex: number,
    subtaskIndex: number,
    priority: string
  ) => {
    setPhases((prev) =>
      prev.map((p, i) =>
        i === phaseIndex
          ? {
              ...p,
              subtasks: p.subtasks.map((s, j) =>
                j === subtaskIndex ? { ...s, priority } : s
              ),
            }
          : p
      )
    );
  };

  if (loading) {
    return (
      <div>
        <TopMenu title={isEdit ? "Edit Project" : "Tambah Project"} />
        <div className="app-content">
          <div className="empty-state">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <TopMenu title={isEdit ? "Edit Project" : "Tambah Project"} />
        <div className="app-content">
          <div className="form-page-container">
            <h2 style={{ marginBottom: 24 }}>
              {isEdit ? "Edit Project Tugas Akhir" : "Tambah Project Tugas Akhir"}
            </h2>

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nama Project</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama project"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Masukkan deskripsi project"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tanggal Mulai</label>
                <SmartDateInput value={startDate} onChange={setStartDate} />
              </div>

              <div className="form-group">
                <label className="form-label">Tanggal Selesai</label>
                <SmartDateInput value={endDate} onChange={setEndDate} />
              </div>

              <div className="form-group">
                <label className="form-label">Data Pembimbing</label>
                {advisors.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                    {advisors.map((a) => (
                      <div
                        key={a.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          backgroundColor: "var(--bg-primary)",
                          borderRadius: 6,
                          fontSize: 14,
                        }}
                      >
                        <span>{a.name}{a.phone ? ` - ${a.phone}` : ""}{a.email ? ` (${a.email})` : ""}</span>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => {
                              setEditingAdvisor(a);
                              setShowAdvisorForm(true);
                            }}
                            title="Edit pembimbing"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={async () => {
                              try {
                                if (isEdit && id && a.id > 0) {
                                  await api.deleteAdvisor(a.id);
                                }
                                setAdvisors((prev) => prev.filter((x) => x.id !== a.id));
                              } catch (err) {
                                setError(String(err));
                              }
                            }}
                            title="Hapus pembimbing"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AB0000" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-primary btn-add"
                  onClick={() => setShowAdvisorForm(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {advisors.length > 0 ? "Tambah Pembimbing" : "Isi Data Pembimbing"}
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Data Partner Projek</label>
                {partners.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                    {partners.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          backgroundColor: "var(--bg-primary)",
                          borderRadius: 6,
                          fontSize: 14,
                        }}
                      >
                        <span>{p.name}{p.phone ? ` - ${p.phone}` : ""}{p.email ? ` (${p.email})` : ""}</span>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => {
                              setEditingPartner(p);
                              setShowPartnerForm(true);
                            }}
                            title="Edit partner"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={async () => {
                              try {
                                if (isEdit && id && p.id > 0) {
                                  await api.deletePartner(p.id);
                                }
                                setPartners((prev) => prev.filter((x) => x.id !== p.id));
                              } catch (err) {
                                setError(String(err));
                              }
                            }}
                            title="Hapus partner"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AB0000" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-primary btn-add"
                  onClick={() => setShowPartnerForm(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {partners.length > 0 ? "Tambah Partner" : "Isi Data Partner Projek"}
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Phase Tugas Akhir</label>
                {!isEdit && (
                  <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>
                    Tambah phase dan tugas yang akan dikerjakan dalam project ini
                  </div>
                )}
                {phases.map((phase, phaseIndex) => (
                  <div
                    key={phaseIndex}
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 8,
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <input
                        type="text"
                        value={phase.name}
                        onChange={(e) => updatePhaseName(phaseIndex, e.target.value)}
                        placeholder={`Nama Phase ${phaseIndex + 1}`}
                        style={{ flex: 1 }}
                        disabled={isEdit}
                      />
                      {!isEdit && (
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => removePhase(phaseIndex)}
                          title="Hapus phase"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AB0000" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {!isEdit && (
                      <>
                        {phase.subtasks.map((subtask, subtaskIndex) => (
                          <div
                            key={subtaskIndex}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 4,
                              padding: "4px 0",
                            }}
                          >
                            <input
                              type="text"
                              value={subtask.name}
                              onChange={(e) =>
                                updateSubtaskName(phaseIndex, subtaskIndex, e.target.value)
                              }
                              placeholder="Nama tugas"
                              style={{ flex: 1 }}
                            />
                            <div style={{ minWidth: 180 }}>
                              <SmartDateInput
                                value={subtask.due_date}
                                onChange={(date) =>
                                  updateSubtaskDueDate(phaseIndex, subtaskIndex, date)
                                }
                              />
                            </div>
                            <select
                              value={subtask.priority}
                              onChange={(e) =>
                                updateSubtaskPriority(phaseIndex, subtaskIndex, e.target.value)
                              }
                              style={{
                                width: 100,
                                fontSize: 13,
                                padding: "6px 8px",
                                borderRadius: 6,
                              }}
                            >
                              <option value="Tinggi">Tinggi</option>
                              <option value="Sedang">Sedang</option>
                              <option value="Rendah">Rendah</option>
                            </select>
                            <button
                              type="button"
                              className="btn-icon"
                              onClick={() =>
                                removeSubtaskFromPhase(phaseIndex, subtaskIndex)
                              }
                              title="Hapus tugas"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AB0000" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn"
                          onClick={() => addSubtaskToPhase(phaseIndex)}
                          style={{ fontSize: 13, marginTop: 4 }}
                        >
                          + Tambah Tugas
                        </button>
                      </>
                    )}

                    {isEdit && phase.subtasks.length > 0 && (
                      <div style={{ fontSize: 13, opacity: 0.8, display: "flex", flexDirection: "column", gap: 4 }}>
                        {phase.subtasks.map((s, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ minWidth: 8 }}>{s.name}</span>
                            {s.priority && (
                              <span className={`badge badge-${s.priority.toLowerCase()}`}>
                                {s.priority}
                              </span>
                            )}
                            {s.due_date ? (
                              <span style={{ opacity: 0.6, fontSize: 12 }}>
                                {s.due_date}
                              </span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {!isEdit && (
                  <button
                    type="button"
                    className="btn btn-primary btn-add"
                    onClick={addPhase}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Tambah Phase
                  </button>
                )}
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
                  {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showAdvisorForm && (
        <AdvisorFormPopup
          projectId={isEdit && id ? Number(id) : 0}
          advisors={advisors}
          editAdvisor={editingAdvisor}
          onSave={handleSaveAdvisor}
          onDelete={handleDeleteAdvisor}
          onClose={() => {
            setShowAdvisorForm(false);
            setEditingAdvisor(null);
          }}
        />
      )}

      {showPartnerForm && (
        <PartnerFormPopup
          projectId={isEdit && id ? Number(id) : 0}
          partners={partners}
          editPartner={editingPartner}
          onSave={handleSavePartner}
          onDelete={handleDeletePartner}
          onClose={() => {
            setShowPartnerForm(false);
            setEditingPartner(null);
          }}
        />
      )}
    </>
  );
}
