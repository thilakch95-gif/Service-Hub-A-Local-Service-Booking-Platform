import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import BrandLogo from "./BrandLogo";

const Navbar = () => {

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (

    <div
      style={{
        height: "60px",
        background: "#1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        color: "white"
      }}
    >

      {/* LEFT SIDE */}

      <div style={{ minWidth: 0 }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          <BrandLogo
            variant="inverse"
            size={40}
            eyebrow="Service marketplace"
            showSubtitle={false}
          />
        </Link>
      </div>

      {/* RIGHT SIDE */}

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

        {/* Notifications */}

        <NotificationBell />

        {/* User info */}

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          <img
            src={
              user?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />

          <span>{user?.fullName}</span>

        </div>

        {/* Logout */}

        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Logout
        </button>

      </div>

    </div>

  );

};

export default Navbar;
