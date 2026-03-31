import { FileText, Image, Lock, Mail, Phone, User, X } from "lucide-react";

const AdminAccountModal = ({
  open,
  title,
  subtitle,
  submitLabel,
  form,
  onChange,
  onClose,
  onSubmit,
  saving = false,
  error = "",
  showProviderFields = false,
}) => {
  if (!open) return null;

  return (
    <div className="modal-scrim">
      <div className="modal-card" style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "24px 24px 18px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div>
            <p className="page-kicker" style={{ marginBottom: "8px" }}>
              Admin Action
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                letterSpacing: "-0.04em",
              }}
            >
              {title}
            </h2>
            <p
              style={{
                margin: "10px 0 0",
                color: "var(--text-secondary)",
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ width: "44px", height: "44px", padding: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ padding: "24px", display: "grid", gap: "16px" }}>
          <div>
            <label className="field-label">Full Name</label>
            <div className="field-shell">
              <User size={18} color="var(--text-faint)" />
              <input
                type="text"
                value={form.fullName}
                onChange={(event) => onChange("fullName", event.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
          </div>

          <div>
            <label className="field-label">Email</label>
            <div className="field-shell">
              <Mail size={18} color="var(--text-faint)" />
              <input
                type="email"
                value={form.email}
                onChange={(event) => onChange("email", event.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div>
            <label className="field-label">Password</label>
            <div className="field-shell">
              <Lock size={18} color="var(--text-faint)" />
              <input
                type="password"
                value={form.password}
                onChange={(event) => onChange("password", event.target.value)}
                placeholder="Create a temporary password"
                required
              />
            </div>
          </div>

          {showProviderFields ? (
            <>
              <div>
                <label className="field-label">Phone</label>
                <div className="field-shell">
                  <Phone size={18} color="var(--text-faint)" />
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(event) => onChange("phone", event.target.value)}
                    placeholder="Optional contact number"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Profile Image URL</label>
                <div className="field-shell">
                  <Image size={18} color="var(--text-faint)" />
                  <input
                    type="text"
                    value={form.profileImage}
                    onChange={(event) => onChange("profileImage", event.target.value)}
                    placeholder="Optional public HTTPS image URL"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Bio</label>
                <div className="field-shell" style={{ alignItems: "flex-start", minHeight: "140px" }}>
                  <FileText size={18} color="var(--text-faint)" style={{ marginTop: "16px" }} />
                  <textarea
                    value={form.bio}
                    onChange={(event) => onChange("bio", event.target.value)}
                    placeholder="Optional profile summary"
                  />
                </div>
              </div>
            </>
          ) : null}

          {error ? (
            <div
              className="panel-soft"
              style={{
                padding: "14px 16px",
                borderRadius: "16px",
                color: "#fca5a5",
                borderColor: "rgba(239,68,68,0.22)",
                background: "rgba(127,29,29,0.18)",
              }}
            >
              {error}
            </div>
          ) : null}

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAccountModal;
