import { useState } from "react";
import type { Advisor } from "../../types";

interface AdvisorFormPopupProps {
  projectId: number;
  advisors: Advisor[];
  onSave: (data: {
    id?: number;
    project_id: number;
    name: string;
    phone: string;
    email: string;
  }) => Promise<void>;
  onClose: () => void;
  editAdvisor?: Advisor | null;
  onDelete?: (id: number) => Promise<void>;
}

export function AdvisorFormPopup({
  projectId,
  advisors,
  onSave,
  onClose,
  editAdvisor,
  onDelete,
}: AdvisorFormPopupProps) {
  const [name, setName] = useState(editAdvisor?.name ?? "");
  const [phone, setPhone] = useState(editAdvisor?.phone ?? "");
  const [email, setEmail] = useState(editAdvisor?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEditing = !!editAdvisor;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await onSave({
        id: editAdvisor?.id,
        project_id: projectId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });
      if (!isEditing) {
        setName("");
        setPhone("");
        setEmail("");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editAdvisor || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(editAdvisor.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>{isEditing ? "Edit Data Pembimbing" : "Input Data Pembimbing"}</h3>
          <button className="btn-icon" onClick={onClose}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {!isEditing && advisors.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 8 }}>
              Pembimbing yang sudah ada:
            </div>
            {advisors.map((advisor) => (
              <div
                key={advisor.id}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "var(--bg-primary)",
                  borderRadius: 6,
                  marginBottom: 4,
                }}
              >
                {advisor.name}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Pembimbing</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama pembimbing"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nomor Telepon</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Masukkan nomor telepon"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
            />
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            {isEditing && onDelete && (
              <button
                type="button"
                className="btn"
                onClick={handleDelete}
                disabled={deleting}
                style={{ color: "#AB0000", marginRight: "auto" }}
              >
                {deleting ? "Menghapus..." : "Hapus"}
              </button>
            )}
            <button type="button" className="btn" onClick={onClose}>
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || !name.trim()}
            >
              {saving ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Pembimbing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
