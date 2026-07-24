import { useState } from "react";

interface PartnerInfoPopupProps {
  name: string;
  phone: string;
  email: string;
  onClose: () => void;
}

export function PartnerInfoPopup({
  name,
  phone,
  email,
  onClose,
}: PartnerInfoPopupProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Gagal menyalin:", error);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Data Partner</h3>
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

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 4 }}>
              Nama
            </div>
            <div style={{ fontSize: 16 }}>{name}</div>
          </div>

          {phone && (
            <div>
              <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 4 }}>
                Nomor Telepon
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  className="action-btn action-btn-whatsapp"
                  onClick={() => handleCopy(phone, "phone")}
                  style={{ cursor: "pointer", border: "none" }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                  {phone}
                </button>
                {copiedField === "phone" && (
                  <span style={{ fontSize: 12, color: "var(--status-selesai)" }}>
                    Tersalin!
                  </span>
                )}
              </div>
            </div>
          )}

          {email && (
            <div>
              <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 4 }}>
                Email
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  className="action-btn action-btn-gmail"
                  onClick={() => handleCopy(email, "email")}
                  style={{ cursor: "pointer", border: "none" }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                  {email}
                </button>
                {copiedField === "email" && (
                  <span style={{ fontSize: 12, color: "var(--status-selesai)" }}>
                    Tersalin!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
