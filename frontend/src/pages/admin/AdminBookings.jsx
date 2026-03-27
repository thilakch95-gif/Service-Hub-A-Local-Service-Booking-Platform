import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Clock3, UserRound } from "lucide-react";
import client from "../../api/client";
import DataTableCard from "../../components/dashboard/DataTableCard";

const statSurfaces = [
  "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(99,102,241,0.1))",
  "linear-gradient(135deg, rgba(100,116,139,0.18), rgba(148,163,184,0.1))",
  "linear-gradient(135deg, rgba(20,184,166,0.18), rgba(14,165,233,0.1))",
];

const statusBadge = (status) => {
  const map = {
    PENDING: { bg: "rgba(100,116,139,0.14)", text: "#64748b" },
    APPROVED: { bg: "rgba(59,130,246,0.12)", text: "#3b82f6" },
    CONFIRMED: { bg: "rgba(34,197,94,0.12)", text: "#16a34a" },
    DECLINED: { bg: "rgba(239,68,68,0.12)", text: "#ef4444" },
    COMPLETED: { bg: "rgba(20,184,166,0.12)", text: "#14b8a6" },
  };
  const style = map[status] || { bg: "rgba(148,163,184,0.12)", text: "#64748b" };

  return (
    <span
      style={{
        background: style.bg,
        color: style.text,
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {status}
    </span>
  );
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.get("/admin/bookings");
        setBookings(res.data || []);
      } catch (err) {
        console.log("Bookings load error", err);
      }
    };

    load();
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Bookings",
        value: bookings.length,
        meta: "Platform-wide booking volume",
        icon: ClipboardList,
      },
      {
        label: "Pending",
        value: bookings.filter((booking) => booking.status === "PENDING").length,
        meta: "Still awaiting response",
        icon: Clock3,
      },
      {
        label: "With Assigned User",
        value: bookings.filter((booking) => booking.user?.email).length,
        meta: "Bookings linked to users",
        icon: UserRound,
      },
    ],
    [bookings]
  );

  const columns = [
    { key: "index", label: "#", render: (_, index) => index + 1 },
    { key: "user", label: "User", render: (row) => row.user?.email || "-" },
    { key: "service", label: "Service", render: (row) => row.service?.title || "-" },
    {
      key: "serviceDate",
      label: "Date",
      render: (row) => (row.serviceDate ? new Date(row.serviceDate).toLocaleDateString() : "-"),
    },
    { key: "status", label: "Status", render: (row) => statusBadge(row.status) },
  ];

  return (
    <div className="app-page">
      <div
        className="panel"
        style={{
          padding: "30px",
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.16), rgba(100,116,139,0.08) 42%, rgba(255,255,255,0.02))",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "18px",
            alignItems: "start",
          }}
        >
          <div>
            <p className="page-kicker">Booking Oversight</p>
            <h1 className="page-title">Bookings</h1>
            <p className="page-subtitle">
              Review platform-wide scheduling activity, linked customers, and workflow progress across all bookings.
            </p>
          </div>

          <div className="panel-soft" style={{ padding: "18px", borderRadius: "22px" }}>
            <p className="stat-label">Operations Signal</p>
            <p style={{ margin: "8px 0 0", fontSize: "26px", fontWeight: 800 }}>{bookings.length}</p>
            <p style={{ margin: "8px 0 0", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "14px" }}>
              Total booking records currently moving through the marketplace.
            </p>
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ marginTop: "24px" }}>
        {stats.map(({ label, value, meta, icon: Icon }, index) => (
          <div key={label} className="panel" style={{ padding: "22px", background: statSurfaces[index] }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <p className="stat-label">{label}</p>
                <p className="stat-value">{value}</p>
                <p className="stat-meta">{meta}</p>
              </div>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "18px",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(255,255,255,0.14)",
                }}
              >
                <Icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "24px" }}>
        <DataTableCard
          kicker="Operations"
          title="All Bookings"
          subtitle="A full system-wide list of booking entries."
          columns={columns}
          rows={bookings}
          accent="#3b82f6"
          headerActions={
            <div className="panel-soft" style={{ padding: "10px 14px", borderRadius: "16px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Pending Queue
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 800 }}>
                {bookings.filter((booking) => booking.status === "PENDING").length}
              </p>
            </div>
          }
          emptyTitle="No bookings found"
          emptyMessage="Bookings will appear here once users start scheduling services."
        />
      </div>
    </div>
  );
};

export default AdminBookings;
