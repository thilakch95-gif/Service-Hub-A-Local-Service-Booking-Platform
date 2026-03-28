import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ roles, children }) => {

  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background: "var(--bg-canvas, #f4f7fb)",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            padding: "24px",
            borderRadius: "24px",
            textAlign: "center",
            background: "var(--bg-surface, #ffffff)",
            border: "1px solid var(--border-subtle, rgba(148,163,184,0.2))",
            boxShadow: "0 20px 45px rgba(15,23,42,0.08)",
          }}
        >
          <p className="page-kicker" style={{ marginBottom: "10px" }}>Restoring Session</p>
          <h2 style={{ margin: 0, fontSize: "24px", fontFamily: "var(--font-display)" }}>
            Loading your workspace...
          </h2>
          <p style={{ margin: "12px 0 0", color: "var(--text-secondary, #475569)", lineHeight: 1.7 }}>
            Your saved session was found. We&apos;re reconnecting to the server and bringing your dashboard back.
          </p>
        </div>
      </div>
    );
  }

  /* NOT LOGGED IN */

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* ROLE NOT ALLOWED */

  if (roles && !roles.includes(user.role)) {

    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "PROVIDER") {
      return <Navigate to="/provider" replace />;
    }

    if (user.role === "USER") {
      return <Navigate to="/user" replace />;
    }

  }

  /* ACCESS GRANTED */

  return children;
};

export default ProtectedRoute;
