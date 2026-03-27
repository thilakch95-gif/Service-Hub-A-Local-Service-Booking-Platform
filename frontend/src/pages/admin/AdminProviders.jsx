import { useEffect, useMemo, useState } from "react";
import { Plus, ShieldCheck, Trash2, UserCheck, Users } from "lucide-react";
import client from "../../api/client";
import AdminAccountModal from "../../components/admin/AdminAccountModal";
import DataTableCard from "../../components/dashboard/DataTableCard";

const statSurfaces = [
  "linear-gradient(135deg, rgba(20,184,166,0.18), rgba(14,165,233,0.1))",
  "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(99,102,241,0.1))",
  "linear-gradient(135deg, rgba(236,72,153,0.18), rgba(168,85,247,0.1))",
];

const providerBadge = (
  <span
    style={{
      background: "rgba(59,130,246,0.12)",
      color: "#3b82f6",
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: 800,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    }}
  >
    Provider
  </span>
);

const AdminProviders = () => {
  const [providers, setProviders] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    profileImage: "",
    bio: "",
  });

  const getErrorMessage = (error, fallback) =>
    error?.response?.data?.message || error?.message || fallback;

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      password: "",
      phone: "",
      profileImage: "",
      bio: "",
    });
    setFormError("");
  };

  const loadProviders = async () => {
    try {
      const res = await client.get("/admin/providers");
      setProviders(res.data || []);
    } catch (err) {
      console.log("Providers load error", err);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const openCreateModal = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    resetForm();
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");

    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        profileImage: form.profileImage.trim(),
        bio: form.bio.trim(),
      };

      const res = await client.post("/admin/providers", payload);
      setProviders((prev) => [res.data, ...prev]);
      closeCreateModal();
    } catch (err) {
      setFormError(getErrorMessage(err, "Unable to create provider account."));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProvider = async (provider) => {
    if (
      !window.confirm(
        `Delete provider account for ${provider.fullName}? This will also remove related services, bookings, payments, reviews, and notifications.`
      )
    ) {
      return;
    }

    setDeletingId(provider.id);

    try {
      await client.delete(`/admin/providers/${provider.id}`);
      setProviders((prev) => prev.filter((item) => item.id !== provider.id));
    } catch (err) {
      window.alert(getErrorMessage(err, "Unable to delete provider account."));
    } finally {
      setDeletingId(null);
    }
  };

  const stats = useMemo(
    () => [
      {
        label: "Providers",
        value: providers.length,
        meta: "Total provider accounts",
        icon: UserCheck,
      },
      {
        label: "Active Records",
        value: providers.filter((provider) => provider.active !== false).length,
        meta: "Currently active accounts",
        icon: ShieldCheck,
      },
      {
        label: "With Contact Info",
        value: providers.filter((provider) => provider.phone || provider.bio).length,
        meta: "Profiles with additional details",
        icon: Users,
      },
    ],
    [providers]
  );

  const columns = [
    { key: "index", label: "#", render: (_, index) => index + 1 },
    { key: "fullName", label: "Name", render: (row) => row.fullName || "-" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone", render: (row) => row.phone || "-" },
    { key: "role", label: "Role", render: () => providerBadge },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <button
          onClick={() => deleteProvider(row)}
          className="btn-danger"
          style={{ padding: "10px 12px" }}
          disabled={deletingId === row.id}
        >
          <Trash2 size={14} />
          {deletingId === row.id ? "Deleting..." : "Delete"}
        </button>
      ),
    },
  ];

  return (
    <div className="app-page">
      <div
        className="panel"
        style={{
          padding: "30px",
          background:
            "linear-gradient(135deg, rgba(20,184,166,0.16), rgba(14,165,233,0.08) 42%, rgba(255,255,255,0.02))",
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
            <p className="page-kicker">Provider Oversight</p>
            <h1 className="page-title">Providers</h1>
            <p className="page-subtitle">
              Create provider accounts for managed onboarding and remove provider access together with their related marketplace records.
            </p>
          </div>

          <div className="panel-soft" style={{ padding: "18px", borderRadius: "22px" }}>
            <p className="stat-label">Coverage Snapshot</p>
            <p style={{ margin: "8px 0 0", fontSize: "26px", fontWeight: 800 }}>{providers.length}</p>
            <p style={{ margin: "8px 0 0", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "14px" }}>
              Provider records currently tracked by the admin directory.
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
          kicker="Directory"
          title="All Providers"
          subtitle="Provider accounts available in the system."
          columns={columns}
          rows={providers}
          accent="#14b8a6"
          headerActions={
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "flex-end" }}>
              <div className="panel-soft" style={{ padding: "10px 14px", borderRadius: "16px" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Active Records
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 800 }}>
                  {providers.filter((provider) => provider.active !== false).length}
                </p>
              </div>
              <button onClick={openCreateModal} className="btn-primary">
                <Plus size={16} />
                Create Provider
              </button>
            </div>
          }
          emptyTitle="No providers found"
          emptyMessage="Provider accounts will appear here once they register."
        />
      </div>

      <AdminAccountModal
        open={isCreateOpen}
        title="Create Provider Account"
        subtitle="Add a new provider account and include profile details used by the marketplace."
        submitLabel="Create Provider"
        form={form}
        onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
        onClose={closeCreateModal}
        onSubmit={handleCreate}
        saving={isSaving}
        error={formError}
        showProviderFields
      />
    </div>
  );
};

export default AdminProviders;
