import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProfileMenu = ({ user }) => {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const goProfile = () => {
    navigate("/profile");
    setOpen(false);
  };

  const goSettings = () => {
    navigate("/settings");
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (

    <div style={{ position: "relative" }}>

      {/* PROFILE BUTTON */}

      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center"
        }}
      >

        {user?.profileImage ? (

          <img
            src={user.profileImage}
            alt="profile"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />

        ) : (

          <User size={22} />

        )}

      </button>

      {/* DROPDOWN */}

      {open && (

        <div
          style={{
            position: "absolute",
            right: 0,
            top: "40px",
            background: "#1e293b",
            color: "white",
            borderRadius: "8px",
            padding: "10px",
            width: "170px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 1000
          }}
        >

          {/* PROFILE */}

          <div
            onClick={goProfile}
            style={{
              padding: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <User size={16} />
            Profile
          </div>

          {/* SETTINGS */}

          <div
            onClick={goSettings}
            style={{
              padding: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Settings size={16} />
            Settings
          </div>

          {/* LOGOUT */}

          <div
            onClick={handleLogout}
            style={{
              padding: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <LogOut size={16} />
            Logout
          </div>

        </div>

      )}

    </div>

  );

};

export default ProfileMenu;
