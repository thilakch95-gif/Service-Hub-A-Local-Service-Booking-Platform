import { useEffect, useState } from "react";
import { MapPin, PlusCircle, Tag, Trash2, Wrench } from "lucide-react";
import client from "../../api/client";

const emptyForm = { title: "", description: "", category: "", price: 0, location: "" };

const serviceCategories = [
  "Repair",
  "Plumbing",
  "Electrician",
  "Cleaning",
  "Carpenter",
  "Mechanic",
];

const categoryThemes = {
  Repair: "linear-gradient(135deg, rgba(59,130,246,0.16), rgba(14,165,233,0.08))",
  Plumbing: "linear-gradient(135deg, rgba(2,132,199,0.16), rgba(14,165,233,0.08))",
  Plumber: "linear-gradient(135deg, rgba(2,132,199,0.16), rgba(14,165,233,0.08))",
  Electrician: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(99,102,241,0.1))",
  Cleaning: "linear-gradient(135deg, rgba(34,197,94,0.16), rgba(16,185,129,0.08))",
  Carpentry: "linear-gradient(135deg, rgba(249,115,22,0.16), rgba(234,88,12,0.08))",
  Carpenter: "linear-gradient(135deg, rgba(249,115,22,0.16), rgba(234,88,12,0.08))",
  Mechanic: "linear-gradient(135deg, rgba(168,85,247,0.16), rgba(217,70,239,0.08))",
};

const ProviderServices = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const loadServices = async () => {
    try {
      const srv = await client.get("/services/provider/me");
      setServices(srv.data.data.content || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const createService = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.location || form.price <= 0) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await client.post("/services", {
        title: form.title,
        description: form.description || "Service description",
        category: form.category,
        price: Number(form.price),
        location: form.location,
      });
      setForm(emptyForm);
      loadServices();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    await client.delete(`/services/${id}`);
    loadServices();
  };

  const getIcon = (service) => {
    const text = `${service.title} ${service.category}`.toLowerCase();
    if (text.includes("ac")) return "/icons/appliances.png";
    if (text.includes("plumb")) return "/icons/plumber.png";
    if (text.includes("electric")) return "/icons/electrician.png";
    if (text.includes("clean")) return "/icons/cleaning.png";
    if (text.includes("mechanic")) return "/icons/mechanic.png";
    if (text.includes("carpent")) return "/icons/carpenter.png";
    return "/icons/default.png";
  };

  return (
    <div className="app-page">
      <div className="panel" style={{ padding: "28px" }}>
        <p className="page-kicker">Service Management</p>
        <h1 className="page-title">My Services</h1>
        <p className="page-subtitle">
          Add, review, and maintain the services customers can book from your provider profile.
        </p>
      </div>

      <div className="panel" style={{ padding: "24px", marginTop: "24px" }}>
        <p className="page-kicker">Create New</p>
        <h2
          style={{
            margin: "0 0 18px",
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            letterSpacing: "-0.04em",
          }}
        >
          Add a service
        </h2>

        <form
          onSubmit={createService}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          <div className="field-shell">
            <Wrench size={18} color="var(--text-faint)" />
            <input
              placeholder="Service title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="field-shell">
            <Tag size={18} color="var(--text-faint)" />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select category</option>
              {serviceCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="field-shell">
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>

          <div className="field-shell">
            <MapPin size={18} color="var(--text-faint)" />
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          <div className="field-shell" style={{ gridColumn: "1 / -1" }}>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ justifySelf: "start" }}>
            <PlusCircle size={16} />
            Add Service
          </button>
        </form>
      </div>

      {services.length === 0 ? (
        <div className="panel empty-state" style={{ marginTop: "24px" }}>
          <Wrench size={34} color="var(--text-faint)" style={{ margin: "0 auto" }} />
          <h3>No services yet</h3>
          <p>Create your first service to start appearing in customer search results.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "18px",
            marginTop: "24px",
          }}
        >
          {services.map((service) => (
            <article key={service.id} className="panel" style={{ overflow: "hidden" }}>
              <div
                style={{
                  minHeight: "180px",
                  padding: "22px",
                  background:
                    categoryThemes[service.category] ||
                    "linear-gradient(135deg, rgba(100,116,139,0.16), rgba(71,85,105,0.08))",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.72)",
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {service.category}
                </div>

                <img
                  src={getIcon(service)}
                  alt={service.title}
                  style={{
                    width: "96px",
                    height: "96px",
                    margin: "18px auto 0",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div style={{ padding: "22px" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "22px",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    margin: "10px 0 0",
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    lineHeight: 1.7,
                  }}
                >
                  {service.description || "Service description"}
                </p>
                <p
                  style={{
                    margin: "12px 0 0",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                  }}
                >
                  <MapPin size={15} />
                  {service.location}
                </p>
                <p
                  style={{
                    margin: "16px 0 0",
                    fontFamily: "var(--font-display)",
                    fontSize: "26px",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                  }}
                >
                  Rs. {Number(service.price || 0).toLocaleString("en-IN")}
                </p>

                <button
                  onClick={() => deleteService(service.id)}
                  className="btn-danger"
                  style={{ width: "100%", marginTop: "20px" }}
                >
                  <Trash2 size={16} />
                  Delete Service
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderServices;
