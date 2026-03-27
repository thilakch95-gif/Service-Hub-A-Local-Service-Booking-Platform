import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Moon,
  Sun,
  User,
  Wrench,
} from "lucide-react";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { roleHome } from "../../utils/routes";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggle } = useTheme();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data } = await client.post("/auth/register", form);
      await login(data.data);
      navigate(roleHome[data.data.role]);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-hero">
          <div
            className="panel-soft"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.08)",
              borderColor: "rgba(255,255,255,0.14)",
              color: "#f8fbff",
            }}
          >
            <Wrench size={16} />
            Join the service platform in minutes
          </div>

          <div style={{ marginTop: "38px", maxWidth: "520px" }}>
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "22px",
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                marginBottom: "22px",
              }}
            >
              <User size={28} />
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.4rem, 5vw, 4.4rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.07em",
              }}
            >
              Create your account and start booking smarter.
            </h1>

            <p
              style={{
                margin: "18px 0 0",
                color: "rgba(255,255,255,0.76)",
                fontSize: "16px",
                lineHeight: 1.8,
              }}
            >
              Register as a customer or provider to access the same polished platform,
              with tools tailored to your role and a clearer end-to-end workflow.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "14px",
              marginTop: "34px",
              maxWidth: "460px",
            }}
          >
            {[
              "User and provider roles available at signup",
              "Consistent UI and dashboard experience after onboarding",
              "Built to support bookings, payments, and reviews",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#f8fbff",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "999px",
                    background: "linear-gradient(135deg, #3b82f6, #14b8a6)",
                  }}
                />
                <span style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-panel">
          <div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}>
            <div>
              <p className="page-kicker">Create Account</p>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: "34px",
                  letterSpacing: "-0.05em",
                }}
              >
                Register
              </h2>
            </div>

            <button onClick={toggle} className="btn-secondary" style={{ width: "46px", height: "46px", padding: 0 }}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <p className="page-subtitle" style={{ marginTop: "12px", maxWidth: "unset" }}>
            Enter your details below and choose the role that matches how you plan to use the platform.
          </p>

          <form onSubmit={submit} style={{ display: "grid", gap: "16px", marginTop: "28px" }}>
            {error && (
              <div
                className="panel-soft"
                style={{
                  padding: "14px 16px",
                  borderColor: "rgba(239,68,68,0.26)",
                  color: "#ef4444",
                  background: "rgba(239,68,68,0.08)",
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label className="field-label">Full Name</label>
              <div className="field-shell">
                <User size={18} color="var(--text-faint)" />
                <input
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="field-label">Email Address</label>
              <div className="field-shell">
                <Mail size={18} color="var(--text-faint)" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="field-shell">
                <Lock size={18} color="var(--text-faint)" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    border: 0,
                    background: "transparent",
                    color: "var(--text-faint)",
                    display: "grid",
                    placeItems: "center",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="field-label">Role</label>
              <div className="field-shell">
                <Briefcase size={18} color="var(--text-faint)" />
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="USER">User</option>
                  <option value="PROVIDER">Provider</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "6px" }} disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
              <ArrowRight size={16} />
            </button>
          </form>

          <div
            className="panel-soft"
            style={{
              marginTop: "22px",
              padding: "18px",
              display: "flex",
              justifyContent: "space-between",
              gap: "14px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 800 }}>Already registered?</p>
              <p style={{ margin: "4px 0 0", color: "var(--text-secondary)", fontSize: "14px" }}>
                Jump back into your dashboard.
              </p>
            </div>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
