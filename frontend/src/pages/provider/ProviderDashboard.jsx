import { useEffect, useMemo, useState } from "react";
import { CheckCircle, ClipboardList, IndianRupee, Star, Wrench } from "lucide-react";
import client from "../../api/client";

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const ProviderDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedServices: 0,
    averageRating: 0,
    totalEarnings: 0,
  });

  const loadStats = async () => {
    try {
      const res = await client.get("/provider/dashboard/stats");
      setStats(res.data || {});
    } catch (err) {
      console.log("Stats error", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const statCards = useMemo(
    () => [
      {
        label: "Total Bookings",
        value: stats.totalBookings || 0,
        meta: "All requests received",
        icon: ClipboardList,
      },
      {
        label: "Completed Services",
        value: stats.completedServices || 0,
        meta: "Jobs marked completed",
        icon: CheckCircle,
      },
      {
        label: "Average Rating",
        value: Number(stats.averageRating || 0).toFixed(1),
        meta: "Across customer reviews",
        icon: Star,
      },
      {
        label: "Total Earnings",
        value: formatCurrency(stats.totalEarnings || 0),
        meta: "Confirmed earnings overview",
        icon: IndianRupee,
      },
    ],
    [stats]
  );

  return (
    <div className="app-page">
      <div className="panel" style={{ padding: "28px" }}>
        <p className="page-kicker">Provider Overview</p>
        <h1 className="page-title">Provider Dashboard</h1>
        <p className="page-subtitle">
          Keep track of bookings, ratings, completed services, and earnings from one clean workspace.
        </p>
      </div>

      <div className="stat-grid" style={{ marginTop: "24px" }}>
        {statCards.map(({ label, value, meta, icon: Icon }) => (
          <div key={label} className="panel" style={{ padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <p className="stat-label">{label}</p>
                <p
                  className="stat-value"
                  style={{ fontSize: typeof value === "string" && value.startsWith("Rs.") ? "28px" : "34px" }}
                >
                  {value}
                </p>
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "18px",
          marginTop: "24px",
        }}
      >
        <div className="panel" style={{ padding: "22px" }}>
          <p className="page-kicker">Performance Notes</p>
          <h2
            style={{
              margin: "0 0 12px",
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              letterSpacing: "-0.04em",
            }}
          >
            Focus areas
          </h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {[
              "Approve pending bookings quickly to keep conversion high.",
              "Mark confirmed jobs completed after finishing service work.",
              "Keep services current so users see accurate pricing and locations.",
            ].map((item) => (
              <div key={item} className="panel-soft" style={{ padding: "16px", borderRadius: "18px" }}>
                <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" style={{ padding: "22px" }}>
          <p className="page-kicker">Quick Summary</p>
          <h2
            style={{
              margin: "0 0 12px",
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              letterSpacing: "-0.04em",
            }}
          >
            Service health
          </h2>
          <div className="panel-soft" style={{ padding: "18px", borderRadius: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "16px",
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(20,184,166,0.14))",
                }}
              >
                <Wrench size={18} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800 }}>Provider account active</p>
                <p style={{ margin: "4px 0 0", color: "var(--text-secondary)", fontSize: "14px" }}>
                  Your dashboard metrics are loading from live booking data.
                </p>
              </div>
            </div>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "14px" }}>
              Use the side navigation to manage services, respond to incoming bookings, review feedback,
              and check analytics in the same visual system as the user dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
