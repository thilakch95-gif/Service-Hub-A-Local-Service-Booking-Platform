import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, UserCheck, Users, UserRound } from "lucide-react";
import client from "../../api/client";
import AdminAccountModal from "../../components/admin/AdminAccountModal";
import DataTableCard from "../../components/dashboard/DataTableCard";

const statSurfaces = [
  "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(56,189,248,0.1))",
  "linear-gradient(135deg, rgba(20,184,166,0.18), rgba(14,165,233,0.1))",
  "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(236,72,153,0.1))",
];

const roleBadge = (role) => {
  const styles = {
    ADMIN: { bg: "rgba(239,68,68,0.12)", text: "#ef4444" },
    PROVIDER: { bg: "rgba(59,130,246,0.12)", text: "#3b82f6" },
    USER: { bg: "rgba(34,197,94,0.12)", text: "#16a34a" },
  };
  const style = styles[role] || { bg: "rgba(148,163,184,0.12)", text: "#64748b" };

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
      {role}
    </span>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
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

  const loadUsers = async () => {
    try {
      const res = await client.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.log("Users load error", err);
    }
  };

  useEffect(() => {
    loadUsers();
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
      };

      const res = await client.post("/admin/users", payload);
      setUsers((prev) => [res.data, ...prev]);
      closeCreateModal();
    } catch (err) {
      setFormError(getErrorMessage(err, "Unable to create user account."));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete user account for ${user.fullName}?`)) return;

    setDeletingId(user.id);

    try {
      await client.delete(`/admin/users/${user.id}`);
      setUsers((prev) => prev.filter((item) => item.id !== user.id));
    } catch (err) {
      window.alert(getErrorMessage(err, "Unable to delete user account."));
    } finally {
      setDeletingId(null);
    }
  };

  const stats = useMemo(
    () => [
      {
        label: "Total Users",
        value: users.length,
        meta: "Customer accounts in the platform",
        icon: Users,
      },
      {
        label: "Active Users",
        value: users.filter((user) => user.active !== false).length,
        meta: "Currently active customer accounts",
        icon: UserCheck,
      },
      {
        label: "With Contact Info",
        value: users.filter((user) => user.phone || user.bio).length,
        meta: "Profiles with extra details",
        icon: UserRound,
      },
    ],
    [users]
  );

  const columns = [
    { key: "index", label: "#", render: (_, index) => index + 1 },
    { key: "fullName", label: "Name", render: (row) => row.fullName || "-" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone", render: (row) => row.phone || "-" },
    {
      key: "role",
      label: "Role",
      render: (row) => roleBadge(row.role),
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <button
          onClick={() => deleteUser(row)}
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
            "linear-gradient(135deg, rgba(59,130,246,0.16), rgba(20,184,166,0.08) 42%, rgba(255,255,255,0.02))",
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
            <p className="page-kicker">Admin Directory</p>
            <h1 className="page-title">Users</h1>
            <p className="page-subtitle">
              Create customer accounts for staff-assisted onboarding and remove accounts that should no longer access the platform.
            </p>
          </div>

          <div className="panel-soft" style={{ padding: "18px", borderRadius: "22px" }}>
            <p className="stat-label">Directory Focus</p>
            <p style={{ margin: "8px 0 0", fontSize: "26px", fontWeight: 800 }}>{users.length}</p>
            <p style={{ margin: "8px 0 0", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "14px" }}>
              Total account records available for review in this directory view.
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
          title="All Users"
          subtitle="Customer accounts currently stored in the platform."
          columns={columns}
          rows={users}
          accent="#3b82f6"
          headerActions={
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "flex-end" }}>
              <div className="panel-soft" style={{ padding: "10px 14px", borderRadius: "16px" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Visible Records
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 800 }}>{users.length}</p>
              </div>
              <button onClick={openCreateModal} className="btn-primary">
                <Plus size={16} />
                Create User
              </button>
            </div>
          }
          emptyTitle="No users found"
          emptyMessage="User records will appear here once accounts have been created."
        />
      </div>

      <AdminAccountModal
        open={isCreateOpen}
        title="Create User Account"
        subtitle="Add a new customer account directly from the admin workspace."
        submitLabel="Create User"
        form={form}
        onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
        onClose={closeCreateModal}
        onSubmit={handleCreate}
        saving={isSaving}
        error={formError}
      />
    </div>
  );
};

export default AdminUsers;
