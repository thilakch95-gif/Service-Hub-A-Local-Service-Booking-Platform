import { useState } from "react";
import { Bell, Lock, Mail, ShieldAlert } from "lucide-react";
import client from "../api/client";

const Settings = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const updatePassword = async () => {
    try {
      await client.post("/users/change-password", {
        oldPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      alert("Password updated successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      console.log("Password update error", err);
    }
  };

  const updateEmail = async () => {
    try {
      await client.put("/users/change-email", {
        newEmail: email,
      });

      alert("Email updated");
      setEmail("");
    } catch (err) {
      console.log("Email update error", err);
    }
  };

  const deleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      await client.delete("/users/delete-account");
      alert("Account deleted");
      window.location.href = "/login";
    } catch (err) {
      console.log("Delete account error", err);
    }
  };

  return (
    <div className="app-page">
      <div className="panel" style={{ padding: "28px" }}>
        <p className="page-kicker">Preferences</p>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Update account security, email preferences, and notification settings from one place.
        </p>
      </div>

      <div style={{ display: "grid", gap: "18px", marginTop: "24px", maxWidth: "920px" }}>
        <section className="panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "18px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "18px",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(20,184,166,0.14))",
              }}
            >
              <Lock size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "28px" }}>
                Change Password
              </h2>
              <p style={{ margin: "6px 0 0", color: "var(--text-secondary)" }}>
                Strengthen your account by setting a new password.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            <div>
              <label className="field-label">Current Password</label>
              <div className="field-shell">
                <Lock size={18} color="var(--text-faint)" />
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <div>
              <label className="field-label">New Password</label>
              <div className="field-shell">
                <Lock size={18} color="var(--text-faint)" />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Create a new password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: "18px", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={updatePassword} className="btn-primary">
              Update Password
            </button>
          </div>
        </section>

        <section className="panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "18px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "18px",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(20,184,166,0.14))",
              }}
            >
              <Mail size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "28px" }}>
                Update Email
              </h2>
              <p style={{ margin: "6px 0 0", color: "var(--text-secondary)" }}>
                Change the email associated with your account.
              </p>
            </div>
          </div>

          <div>
            <label className="field-label">New Email Address</label>
            <div className="field-shell">
              <Mail size={18} color="var(--text-faint)" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: "18px", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={updateEmail} className="btn-primary">
              Update Email
            </button>
          </div>
        </section>

        <section className="panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "18px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "18px",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(20,184,166,0.14))",
              }}
            >
              <Bell size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "28px" }}>
                Notifications
              </h2>
              <p style={{ margin: "6px 0 0", color: "var(--text-secondary)" }}>
                Choose whether booking-related notifications stay enabled.
              </p>
            </div>
          </div>

          <div
            className="panel-soft"
            style={{
              padding: "16px 18px",
              display: "flex",
              justifyContent: "space-between",
              gap: "14px",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 800 }}>Enable notifications</p>
              <p style={{ margin: "4px 0 0", color: "var(--text-secondary)", fontSize: "14px" }}>
                Receive booking and system updates in the app.
              </p>
            </div>
            <button
              onClick={() => setNotifications((prev) => !prev)}
              className={notifications ? "btn-primary" : "btn-secondary"}
            >
              {notifications ? "On" : "Off"}
            </button>
          </div>
        </section>

        <section
          className="panel"
          style={{
            padding: "24px",
            borderColor: "rgba(239,68,68,0.22)",
          }}
        >
          <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "18px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "18px",
                display: "grid",
                placeItems: "center",
                background: "rgba(239,68,68,0.12)",
                color: "#ef4444",
              }}
            >
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "28px" }}>
                Danger Zone
              </h2>
              <p style={{ margin: "6px 0 0", color: "var(--text-secondary)" }}>
                Deleting your account is permanent and cannot be undone.
              </p>
            </div>
          </div>

          <button onClick={deleteAccount} className="btn-danger">
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
