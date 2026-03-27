import { useEffect, useMemo, useState } from "react";
import { MapPin, Tag, Wrench } from "lucide-react";
import client from "../../api/client";
import DataTableCard from "../../components/dashboard/DataTableCard";

const statSurfaces = [
  "linear-gradient(135deg, rgba(236,72,153,0.18), rgba(168,85,247,0.1))",
  "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(236,72,153,0.1))",
  "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(56,189,248,0.1))",
];

const AdminServices = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.get("/admin/services");
        setServices(res.data || []);
      } catch (err) {
        console.log("Services load error", err);
      }
    };

    load();
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Services",
        value: services.length,
        meta: "Total service listings",
        icon: Wrench,
      },
      {
        label: "Categories",
        value: new Set(services.map((service) => service.category).filter(Boolean)).size,
        meta: "Distinct categories in use",
        icon: Tag,
      },
      {
        label: "Locations",
        value: new Set(services.map((service) => service.location).filter(Boolean)).size,
        meta: "Cities or areas covered",
        icon: MapPin,
      },
    ],
    [services]
  );

  const columns = [
    { key: "index", label: "#", render: (_, index) => index + 1 },
    { key: "title", label: "Title" },
    { key: "category", label: "Category", render: (row) => row.category || "-" },
    {
      key: "price",
      label: "Price",
      render: (row) => `Rs. ${Number(row.price || 0).toLocaleString("en-IN")}`,
    },
    { key: "location", label: "Location", render: (row) => row.location || "-" },
  ];

  return (
    <div className="app-page">
      <div
        className="panel"
        style={{
          padding: "30px",
          background:
            "linear-gradient(135deg, rgba(236,72,153,0.16), rgba(168,85,247,0.08) 42%, rgba(255,255,255,0.02))",
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
            <p className="page-kicker">Catalog Overview</p>
            <h1 className="page-title">Services</h1>
            <p className="page-subtitle">
              Review marketplace inventory across categories, coverage areas, and pricing bands.
            </p>
          </div>

          <div className="panel-soft" style={{ padding: "18px", borderRadius: "22px" }}>
            <p className="stat-label">Catalog Density</p>
            <p style={{ margin: "8px 0 0", fontSize: "26px", fontWeight: 800 }}>{services.length}</p>
            <p style={{ margin: "8px 0 0", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "14px" }}>
              Total service listings currently published across the platform.
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
          kicker="Inventory"
          title="All Services"
          subtitle="A full list of service entries currently available on the platform."
          columns={columns}
          rows={services}
          accent="#f97316"
          headerActions={
            <div className="panel-soft" style={{ padding: "10px 14px", borderRadius: "16px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Unique Categories
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 800 }}>
                {new Set(services.map((service) => service.category).filter(Boolean)).size}
              </p>
            </div>
          }
          emptyTitle="No services found"
          emptyMessage="Services will appear here once providers publish them."
        />
      </div>
    </div>
  );
};

export default AdminServices;
