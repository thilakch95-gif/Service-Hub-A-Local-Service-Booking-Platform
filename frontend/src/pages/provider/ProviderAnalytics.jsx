import { useEffect, useMemo, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { BarChart3, ClipboardList, IndianRupee, TrendingUp } from "lucide-react";
import client from "../../api/client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ProviderAnalytics = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const loadAnalytics = async () => {
    try {
      const cat = await client.get("/provider/analytics/categories");
      setCategoryData(cat.data || []);

      const earn = await client.get("/provider/analytics/earnings");
      setEarningsData(earn.data || []);

      const status = await client.get("/provider/analytics/status");
      setStatusData(status.data || []);

      const top = await client.get("/provider/analytics/top-services");
      setTopServices(top.data || []);

      const stats = await client.get("/provider/dashboard/stats");
      setTotalBookings(stats.data.totalBookings || 0);
      setTotalEarnings(stats.data.totalEarnings || 0);
    } catch (err) {
      console.log("Analytics error", err);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const formattedEarnings = useMemo(
    () =>
      earningsData.map((entry) => ({
        ...entry,
        monthLabel: monthNames[entry.month] || String(entry.month),
      })),
    [earningsData]
  );

  const growth = useMemo(() => {
    if (formattedEarnings.length < 2) return "0.0";
    const latest = Number(formattedEarnings[formattedEarnings.length - 1]?.earnings || 0);
    const previous = Number(formattedEarnings[formattedEarnings.length - 2]?.earnings || 0);
    if (!previous) return latest ? "100.0" : "0.0";
    return (((latest - previous) / previous) * 100).toFixed(1);
  }, [formattedEarnings]);

  const statCards = [
    {
      label: "Total Bookings",
      value: totalBookings,
      meta: "All tracked provider bookings",
      icon: ClipboardList,
    },
    {
      label: "Total Earnings",
      value: `Rs. ${Number(totalEarnings || 0).toLocaleString("en-IN")}`,
      meta: "Revenue from booking activity",
      icon: IndianRupee,
    },
    {
      label: "Earnings Growth",
      value: `${growth}%`,
      meta: "Compared with previous period",
      icon: TrendingUp,
    },
  ];

  const chartLabelColor = "#94a3b8";
  const gridColor = "rgba(148,163,184,0.14)";

  const commonLegend = {
    labels: {
      color: chartLabelColor,
      font: { family: "Manrope", size: 12 },
      usePointStyle: true,
      boxWidth: 8,
    },
  };

  const commonTooltip = {
    backgroundColor: "#0f172a",
    titleColor: "#e2e8f0",
    bodyColor: "#cbd5e1",
    borderColor: "rgba(148,163,184,0.18)",
    borderWidth: 1,
    padding: 12,
  };

  const categoryChartData = {
    labels: categoryData.map((item) => item.category),
    datasets: [
      {
        label: "Bookings",
        data: categoryData.map((item) => item.totalBookings),
        borderRadius: 10,
        backgroundColor: "rgba(59,130,246,0.72)",
      },
    ],
  };

  const earningsChartData = {
    labels: formattedEarnings.map((item) => item.monthLabel),
    datasets: [
      {
        label: "Earnings",
        data: formattedEarnings.map((item) => item.earnings),
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20,184,166,0.16)",
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const statusChartData = {
    labels: statusData.map((item) => item.status),
    datasets: [
      {
        data: statusData.map((item) => item.value),
        backgroundColor: ["#3b82f6", "#14b8a6", "#8b5cf6", "#64748b", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const topServicesChartData = {
    labels: topServices.map((item) => item.serviceName),
    datasets: [
      {
        label: "Bookings",
        data: topServices.map((item) => item.bookings),
        borderRadius: 10,
        backgroundColor: "rgba(139,92,246,0.72)",
      },
    ],
  };

  const axisOptions = {
    responsive: true,
    plugins: { legend: commonLegend, tooltip: commonTooltip },
    scales: {
      x: {
        ticks: { color: chartLabelColor, font: { family: "Manrope" } },
        grid: { color: gridColor },
        border: { color: "transparent" },
      },
      y: {
        ticks: { color: chartLabelColor, font: { family: "Manrope" } },
        grid: { color: gridColor },
        border: { color: "transparent" },
      },
    },
  };

  return (
    <div className="app-page">
      <div className="panel" style={{ padding: "28px" }}>
        <p className="page-kicker">Business Insights</p>
        <h1 className="page-title">Provider Analytics</h1>
        <p className="page-subtitle">
          Review booking performance, service demand, earnings trends, and completion status from one dashboard.
        </p>
      </div>

      <div className="stat-grid" style={{ marginTop: "24px" }}>
        {statCards.map(({ label, value, meta, icon: Icon }) => (
          <div key={label} className="panel" style={{ padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <p className="stat-label">{label}</p>
                <p className="stat-value" style={{ fontSize: String(value).startsWith("Rs.") ? "28px" : "34px" }}>
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
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "18px",
          marginTop: "24px",
        }}
      >
        <div className="panel" style={{ padding: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <BarChart3 size={18} />
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "24px" }}>
              Service Category Performance
            </h2>
          </div>
          <div style={{ height: "300px" }}>
            <Bar data={categoryChartData} options={axisOptions} />
          </div>
        </div>

        <div className="panel" style={{ padding: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <TrendingUp size={18} />
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "24px" }}>
              Monthly Earnings
            </h2>
          </div>
          <div style={{ height: "300px" }}>
            <Line data={earningsChartData} options={axisOptions} />
          </div>
        </div>

        <div className="panel" style={{ padding: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <ClipboardList size={18} />
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "24px" }}>
              Job Status Distribution
            </h2>
          </div>
          <div style={{ height: "300px" }}>
            <Doughnut
              data={statusChartData}
              options={{
                responsive: true,
                plugins: { legend: commonLegend, tooltip: commonTooltip },
                cutout: "66%",
              }}
            />
          </div>
        </div>

        <div className="panel" style={{ padding: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <BarChart3 size={18} />
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "24px" }}>
              Top Performing Services
            </h2>
          </div>
          <div style={{ height: "300px" }}>
            <Bar
              data={topServicesChartData}
              options={{
                ...axisOptions,
                indexAxis: "y",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderAnalytics;
