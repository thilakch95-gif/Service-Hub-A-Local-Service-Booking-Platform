import { useEffect, useMemo, useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  ClipboardList,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import client from "../../api/client";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const accentPairs = [
  {
    glow: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(56,189,248,0.12))",
    tint: "rgba(59,130,246,0.16)",
  },
  {
    glow: "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(20,184,166,0.12))",
    tint: "rgba(20,184,166,0.16)",
  },
  {
    glow: "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(236,72,153,0.12))",
    tint: "rgba(168,85,247,0.16)",
  },
  {
    glow: "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.12))",
    tint: "rgba(99,102,241,0.16)",
  },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    providers: 0,
    services: 0,
    bookings: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.get("/admin/stats");
        setStats(res.data || {});
      } catch (err) {
        console.log("Admin stats error:", err);
      }
    };

    load();
  }, []);

  const statCards = useMemo(
    () => [
      {
        label: "Total Users",
        value: stats.users || 0,
        meta: "Registered customer accounts",
        icon: Users,
        detail: "Customer acquisition and retention footprint",
      },
      {
        label: "Providers",
        value: stats.providers || 0,
        meta: "Active provider accounts",
        icon: UserCheck,
        detail: "Supply-side growth across service categories",
      },
      {
        label: "Services",
        value: stats.services || 0,
        meta: "Published service listings",
        icon: Wrench,
        detail: "Inventory currently visible in the marketplace",
      },
      {
        label: "Bookings",
        value: stats.bookings || 0,
        meta: "Platform booking volume",
        icon: ClipboardList,
        detail: "Operational demand moving through the funnel",
      },
    ],
    [stats]
  );

  const chartData = {
    labels: ["Users", "Providers", "Services", "Bookings"],
    datasets: [
      {
        label: "Platform Totals",
        data: [stats.users, stats.providers, stats.services, stats.bookings],
        borderRadius: 12,
        backgroundColor: [
          "rgba(59,130,246,0.72)",
          "rgba(139,92,246,0.72)",
          "rgba(20,184,166,0.72)",
          "rgba(99,102,241,0.72)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#94a3b8",
          font: { family: "Manrope", size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#e2e8f0",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(148,163,184,0.18)",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8", font: { family: "Manrope" } },
        grid: { color: "rgba(148,163,184,0.12)" },
        border: { color: "transparent" },
      },
      y: {
        ticks: { color: "#94a3b8", font: { family: "Manrope" } },
        grid: { color: "rgba(148,163,184,0.12)" },
        border: { color: "transparent" },
      },
    },
  };

  return (
    <div className="app-page">
      <div
        className="panel"
        style={{
          padding: "30px",
          overflow: "hidden",
          position: "relative",
          background:
            "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(59,130,246,0.1) 35%, rgba(168,85,247,0.08) 100%)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "320px",
            height: "320px",
            right: "-90px",
            top: "-120px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.2), transparent 66%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
            alignItems: "stretch",
            position: "relative",
          }}
        >
          <div>
            <p className="page-kicker">Platform Control</p>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle" style={{ maxWidth: "760px" }}>
              Monitor growth, operational load, and marketplace quality from a single command center that matches the polished user and provider experience.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              {[
                {
                  label: "Customer-to-provider ratio",
                  value:
                    stats.providers > 0 ? `${Math.max((stats.users / stats.providers).toFixed(1), 0)} : 1` : "0 : 1",
                },
                {
                  label: "Services per provider",
                  value:
                    stats.providers > 0 ? (stats.services / stats.providers).toFixed(1) : "0.0",
                },
                {
                  label: "Bookings per service",
                  value:
                    stats.services > 0 ? (stats.bookings / stats.services).toFixed(1) : "0.0",
                },
              ].map((item) => (
                <div key={item.label} className="panel-soft" style={{ padding: "16px 18px", borderRadius: "20px" }}>
                  <p className="stat-label">{item.label}</p>
                  <p style={{ margin: "8px 0 0", fontSize: "28px", fontWeight: 800 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="panel-soft"
            style={{
              padding: "22px",
              borderRadius: "24px",
              display: "grid",
              gap: "14px",
              alignSelf: "stretch",
            }}
          >
            <div>
              <p className="page-kicker">Health Snapshot</p>
              <h2
                style={{
                  margin: "0",
                  fontFamily: "var(--font-display)",
                  fontSize: "30px",
                  letterSpacing: "-0.04em",
                }}
              >
                Marketplace pulse
              </h2>
            </div>
            {[
              {
                title: "Supply coverage",
                text: "Providers and services should grow together to keep discovery healthy.",
              },
              {
                title: "Demand movement",
                text: "Bookings tell you whether the catalog is converting into real activity.",
              },
              {
                title: "Operational balance",
                text: "Large spikes in one metric usually need closer moderation or support.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                style={{
                  padding: "14px 16px",
                  borderRadius: "18px",
                  background: accentPairs[index].glow,
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <p style={{ margin: 0, fontWeight: 800 }}>{item.title}</p>
                <p style={{ margin: "6px 0 0", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "14px" }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ marginTop: "24px" }}>
        {statCards.map(({ label, value, meta, detail, icon: Icon }, index) => (
          <div
            key={label}
            className="panel"
            style={{
              padding: "22px",
              background: accentPairs[index].glow,
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <p className="stat-label">{label}</p>
                <p className="stat-value">{value}</p>
                <p className="stat-meta">{meta}</p>
                <p
                  style={{
                    margin: "10px 0 0",
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    lineHeight: 1.7,
                  }}
                >
                  {detail}
                </p>
              </div>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "18px",
                  display: "grid",
                  placeItems: "center",
                  background: accentPairs[index].tint,
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
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "18px",
          marginTop: "24px",
        }}
      >
        <div className="panel" style={{ padding: "24px", overflow: "hidden", position: "relative" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "0 0 auto",
              height: "100px",
              background: "linear-gradient(135deg, rgba(59,130,246,0.15), transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <p className="page-kicker">Analytics Snapshot</p>
          <h2
            style={{
              margin: "0 0 18px",
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              letterSpacing: "-0.04em",
            }}
          >
            Platform totals
          </h2>
          <p style={{ margin: "0 0 18px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            A quick comparison of core marketplace counts so you can spot imbalance at a glance.
          </p>
          <div style={{ height: "360px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="panel" style={{ padding: "24px", overflow: "hidden", position: "relative" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "0 0 auto",
              height: "100px",
              background: "linear-gradient(135deg, rgba(168,85,247,0.14), transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <p className="page-kicker">Admin Notes</p>
          <h2
            style={{
              margin: "0 0 18px",
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              letterSpacing: "-0.04em",
            }}
          >
            Oversight checklist
          </h2>

          <div style={{ display: "grid", gap: "12px" }}>
            {[
              {
                title: "Review users and providers",
                text: "Spot unusual growth or role distribution changes quickly.",
                icon: Shield,
              },
              {
                title: "Track booking volume",
                text: "Use booking counts as the clearest indicator of marketplace activity.",
                icon: ClipboardList,
              },
              {
                title: "Watch growth trends",
                text: "A balanced increase across users, providers, and services keeps the platform healthy.",
                icon: TrendingUp,
              },
            ].map(({ title, text, icon: Icon }) => (
              <div key={title} className="panel-soft" style={{ padding: "16px", borderRadius: "18px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "14px",
                      display: "grid",
                      placeItems: "center",
                      background:
                        "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(20,184,166,0.14))",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800 }}>{title}</p>
                    <p style={{ margin: "6px 0 0", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "14px" }}>
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
