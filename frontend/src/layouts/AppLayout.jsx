import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MenuSquare,
  Moon,
  Settings,
  Shield,
  Star,
  Sun,
  User,
  Users,
  Wrench,
} from "lucide-react";
import NotificationBell from "../components/NotificationBell";
import BrandLogo from "../components/BrandLogo";

const linksByRole = {
  USER: [
    { to: "/user", label: "Dashboard", icon: LayoutDashboard },
    { to: "/user/bookings", label: "My Bookings", icon: ClipboardList },
    { to: "/user/reviews", label: "My Reviews", icon: Star },
  ],
  PROVIDER: [
    { to: "/provider", label: "Dashboard", icon: LayoutDashboard },
    { to: "/provider/services", label: "Services", icon: Wrench },
    { to: "/provider/bookings", label: "Bookings", icon: ClipboardList },
    { to: "/provider/reviews", label: "Reviews", icon: Star },
    { to: "/provider/analytics", label: "Analytics", icon: BarChart3 },
  ],
  ADMIN: [
    { to: "/admin", label: "Dashboard", icon: Shield },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/providers", label: "Providers", icon: Users },
    { to: "/admin/services", label: "Services", icon: Wrench },
    { to: "/admin/bookings", label: "Bookings", icon: ClipboardList },
    { to: "/admin/reviews", label: "Reviews", icon: Star },
  ],
};

const titleByPath = {
  "/user": "User Dashboard",
  "/user/bookings": "Bookings",
  "/user/reviews": "Reviews",
  "/provider": "Provider Dashboard",
  "/provider/services": "Services",
  "/provider/bookings": "Bookings",
  "/provider/reviews": "Reviews",
  "/provider/analytics": "Analytics",
  "/admin": "Admin Dashboard",
  "/admin/users": "Users",
  "/admin/providers": "Providers",
  "/admin/services": "Services",
  "/admin/bookings": "Bookings",
  "/admin/reviews": "Reviews",
  "/profile": "Profile",
  "/settings": "Settings",
};

const AppLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const links = linksByRole[user?.role] || [];
  const initials = user?.fullName?.charAt(0)?.toUpperCase() || "U";
  const currentTitle = useMemo(
    () => titleByPath[location.pathname] || "Workspace",
    [location.pathname]
  );

  useEffect(() => {
    setOpenMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
            gap: "16px",
          }}
        >
          <div
            className="panel-soft"
            style={{
              padding: "18px",
            }}
          >
            <BrandLogo
              title="Local Service Finder"
              eyebrow="Operations workspace"
              subtitle="Users, providers, and admins connected"
            />
          </div>

          <div
            className="panel"
            style={{
              padding: "18px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.fullName}
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "18px",
                  objectFit: "cover",
                  border: "1px solid var(--border-subtle)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "18px",
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.24), rgba(20,184,166,0.24))",
                  fontWeight: 800,
                  fontSize: "18px",
                }}
              >
                {initials}
              </div>
            )}

            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Signed In
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "15px",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.fullName}
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  color: "var(--text-faint)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {user?.role}
              </p>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              minHeight: 0,
              paddingBottom: "14px",
              overflowY: "auto",
              paddingRight: "4px",
            }}
          >
            <p className="page-kicker" style={{ paddingLeft: "10px" }}>
              Navigation
            </p>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginTop: "12px",
              }}
            >
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={
                      link.to === "/user" ||
                      link.to === "/provider" ||
                      link.to === "/admin"
                    }
                    style={({ isActive }) => ({
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "11px 12px",
                      borderRadius: "18px",
                      textDecoration: "none",
                      border: `1px solid ${
                        isActive ? "rgba(59,130,246,0.24)" : "transparent"
                      }`,
                      background: isActive
                        ? "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(20,184,166,0.12))"
                        : "transparent",
                      color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                      boxShadow: isActive ? "var(--shadow-soft)" : "none",
                      fontSize: "13px",
                      fontWeight: isActive ? 800 : 700,
                      whiteSpace: "nowrap",
                      minWidth: 0,
                    })}
                  >
                    <span
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "14px",
                        display: "grid",
                        placeItems: "center",
                        background: "var(--bg-soft)",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={17} />
                    </span>
                    <span
                      style={{
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {link.label}
                    </span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div
            className="panel-soft"
            style={{
              padding: "12px",
              borderRadius: "20px",
              marginTop: "12px",
              borderTop: "1px solid var(--border-subtle)",
              flexShrink: 0,
            }}
          >
            <button
              onClick={logout}
              className="btn-danger"
              style={{ width: "100%" }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-header">
          <div style={{ minWidth: 0 }}>
            <p className="page-kicker" style={{ marginBottom: "6px" }}>
              Workspace
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: "26px",
                  letterSpacing: "-0.04em",
                }}
              >
                {currentTitle}
              </h2>
              <span
                className="panel-soft"
                style={{
                  padding: "8px 12px",
                  borderRadius: "999px",
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {user?.role}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <div
              className="panel-soft"
              style={{
                padding: "10px 14px",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <MenuSquare size={16} color="var(--text-secondary)" />
              <span
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                {location.pathname}
              </span>
            </div>

            <NotificationBell />

            <button
              onClick={toggle}
              className="btn-secondary"
              title={isDark ? "Light mode" : "Dark mode"}
              style={{ paddingInline: "14px" }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setOpenMenu((prev) => !prev)}
                className="btn-secondary"
                style={{ padding: "8px 10px 8px 8px", borderRadius: "999px" }}
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      background:
                        "linear-gradient(135deg, rgba(59,130,246,0.24), rgba(20,184,166,0.24))",
                      fontWeight: 800,
                    }}
                  >
                    {initials}
                  </span>
                )}
                <span
                  style={{
                    maxWidth: "140px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.fullName}
                </span>
              </button>

              {openMenu && (
                <div className="notification-popover" style={{ width: "240px" }}>
                  <div style={{ padding: "18px" }}>
                    <p className="page-kicker" style={{ marginBottom: "8px" }}>
                      Account
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: 800,
                      }}
                    >
                      {user?.fullName}
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "var(--text-secondary)",
                        fontSize: "13px",
                      }}
                    >
                      Manage your account and preferences
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "0 12px 12px",
                      display: "grid",
                      gap: "8px",
                    }}
                  >
                    <Link
                      to="/profile"
                      className="btn-secondary"
                      style={{ justifyContent: "flex-start" }}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="btn-secondary"
                      style={{ justifyContent: "flex-start" }}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="btn-danger"
                      style={{ width: "100%" }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
