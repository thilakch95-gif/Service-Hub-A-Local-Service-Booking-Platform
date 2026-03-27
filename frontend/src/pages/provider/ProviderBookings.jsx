import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  CheckCircle,
  ClipboardList,
  Clock3,
  UserRound,
  XCircle,
} from "lucide-react";
import client from "../../api/client";

const statusConfig = {
  PENDING: { bg: "rgba(100,116,139,0.14)", text: "#64748b" },
  APPROVED: { bg: "rgba(59,130,246,0.12)", text: "#3b82f6" },
  CONFIRMED: { bg: "rgba(34,197,94,0.12)", text: "#16a34a" },
  DECLINED: { bg: "rgba(239,68,68,0.12)", text: "#ef4444" },
  COMPLETED: { bg: "rgba(20,184,166,0.12)", text: "#14b8a6" },
};

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);

  const load = async () => {
    try {
      const bk = await client.get("/bookings/provider/me");
      setBookings(bk.data.data || []);
    } catch (err) {
      console.log("Provider load error:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await client.patch(`/bookings/${id}/status`, { status });
      load();
    } catch (err) {
      console.log(err);
    }
  };

  const markCompleted = async (id) => {
    try {
      await client.patch(`/bookings/${id}/complete`);
      load();
    } catch (err) {
      console.log(err);
    }
  };

  const stats = useMemo(
    () => [
      {
        label: "Incoming Bookings",
        value: bookings.length,
        meta: "All provider-side booking requests",
        icon: ClipboardList,
      },
      {
        label: "Pending",
        value: bookings.filter((booking) => booking.status === "PENDING").length,
        meta: "Need approval or decline",
        icon: Clock3,
      },
      {
        label: "Confirmed",
        value: bookings.filter((booking) => booking.status === "CONFIRMED").length,
        meta: "Ready to complete",
        icon: BadgeCheck,
      },
    ],
    [bookings]
  );

  return (
    <div className="app-page">
      <div className="panel" style={{ padding: "28px" }}>
        <p className="page-kicker">Booking Queue</p>
        <h1 className="page-title">Incoming Bookings</h1>
        <p className="page-subtitle">
          Review new service requests, approve or decline pending jobs, and complete confirmed work.
        </p>
      </div>

      <div className="stat-grid" style={{ marginTop: "24px" }}>
        {stats.map(({ label, value, meta, icon: Icon }) => (
          <div key={label} className="panel" style={{ padding: "22px" }}>
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
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(20,184,166,0.14))",
                }}
              >
                <Icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 ? (
        <div className="panel empty-state" style={{ marginTop: "24px" }}>
          <ClipboardList size={34} color="var(--text-faint)" style={{ margin: "0 auto" }} />
          <h3>No bookings yet</h3>
          <p>New requests from customers will appear here as soon as they book your services.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
          {bookings.map((booking) => {
            const status = statusConfig[booking.status] || statusConfig.PENDING;

            return (
              <article key={booking.id} className="panel" style={{ padding: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "18px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        width: "58px",
                        height: "58px",
                        borderRadius: "20px",
                        display: "grid",
                        placeItems: "center",
                        background: status.bg,
                        color: status.text,
                        flexShrink: 0,
                      }}
                    >
                      <ClipboardList size={24} />
                    </div>

                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "22px",
                          fontFamily: "var(--font-display)",
                          letterSpacing: "-0.04em",
                        }}
                      >
                        {booking.serviceTitle}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "14px",
                          alignItems: "center",
                          flexWrap: "wrap",
                          marginTop: "10px",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "var(--text-secondary)",
                            fontSize: "14px",
                          }}
                        >
                          <UserRound size={15} />
                          {booking.userName}
                        </span>
                        <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                          {new Date(booking.serviceDate).toLocaleDateString()}
                        </span>
                        <span
                          style={{
                            padding: "8px 12px",
                            borderRadius: "999px",
                            background: status.bg,
                            color: status.text,
                            fontSize: "11px",
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {booking.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => updateStatus(booking.id, "APPROVED")}
                          className="btn-primary"
                        >
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, "DECLINED")}
                          className="btn-danger"
                        >
                          <XCircle size={16} />
                          Decline
                        </button>
                      </>
                    )}

                    {booking.status === "CONFIRMED" && (
                      <button onClick={() => markCompleted(booking.id)} className="btn-secondary">
                        <BadgeCheck size={16} />
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProviderBookings;
