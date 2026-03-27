import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  MapPin,
  Moon,
  Search,
  Star,
  Sun,
  Tag,
  UserRound,
} from "lucide-react";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import PaymentModal from "../../components/PaymentModal";

const CATEGORY_THEMES = {
  Cleaning: {
    accent: "#15803d",
    background: "linear-gradient(135deg, rgba(22,163,74,0.24), rgba(187,247,208,0.2) 58%, rgba(255,255,255,0.02))",
    glow: "radial-gradient(circle at top right, rgba(34,197,94,0.28), transparent 58%)",
    badgeBackground: "rgba(240,253,244,0.88)",
    badgeText: "#166534",
    priceBackground: "rgba(20,83,45,0.88)",
    priceText: "#f0fdf4",
    providerBackground: "rgba(22,163,74,0.12)",
  },
  Electrician: {
    accent: "#2563eb",
    background: "linear-gradient(135deg, rgba(59,130,246,0.24), rgba(191,219,254,0.22) 58%, rgba(255,255,255,0.02))",
    glow: "radial-gradient(circle at top right, rgba(96,165,250,0.28), transparent 58%)",
    badgeBackground: "rgba(239,246,255,0.88)",
    badgeText: "#1d4ed8",
    priceBackground: "rgba(30,64,175,0.88)",
    priceText: "#eff6ff",
    providerBackground: "rgba(59,130,246,0.12)",
  },
  Plumbing: {
    accent: "#0f766e",
    background: "linear-gradient(135deg, rgba(20,184,166,0.24), rgba(153,246,228,0.2) 58%, rgba(255,255,255,0.02))",
    glow: "radial-gradient(circle at top right, rgba(45,212,191,0.28), transparent 58%)",
    badgeBackground: "rgba(240,253,250,0.88)",
    badgeText: "#115e59",
    priceBackground: "rgba(19,78,74,0.88)",
    priceText: "#f0fdfa",
    providerBackground: "rgba(20,184,166,0.12)",
  },
  Plumber: {
    accent: "#0f766e",
    background: "linear-gradient(135deg, rgba(20,184,166,0.24), rgba(153,246,228,0.2) 58%, rgba(255,255,255,0.02))",
    glow: "radial-gradient(circle at top right, rgba(45,212,191,0.28), transparent 58%)",
    badgeBackground: "rgba(240,253,250,0.88)",
    badgeText: "#115e59",
    priceBackground: "rgba(19,78,74,0.88)",
    priceText: "#f0fdfa",
    providerBackground: "rgba(20,184,166,0.12)",
  },
  Painting: {
    accent: "#9333ea",
    background: "linear-gradient(135deg, rgba(168,85,247,0.24), rgba(233,213,255,0.2) 58%, rgba(255,255,255,0.02))",
    glow: "radial-gradient(circle at top right, rgba(192,132,252,0.28), transparent 58%)",
    badgeBackground: "rgba(250,245,255,0.88)",
    badgeText: "#7e22ce",
    priceBackground: "rgba(88,28,135,0.9)",
    priceText: "#faf5ff",
    providerBackground: "rgba(168,85,247,0.12)",
  },
  Carpentry: {
    accent: "#c2410c",
    background: "linear-gradient(135deg, rgba(249,115,22,0.24), rgba(254,215,170,0.22) 58%, rgba(255,255,255,0.02))",
    glow: "radial-gradient(circle at top right, rgba(251,146,60,0.28), transparent 58%)",
    badgeBackground: "rgba(255,247,237,0.9)",
    badgeText: "#9a3412",
    priceBackground: "rgba(124,45,18,0.88)",
    priceText: "#fff7ed",
    providerBackground: "rgba(249,115,22,0.12)",
  },
  Carpenter: {
    accent: "#c2410c",
    background: "linear-gradient(135deg, rgba(249,115,22,0.24), rgba(254,215,170,0.22) 58%, rgba(255,255,255,0.02))",
    glow: "radial-gradient(circle at top right, rgba(251,146,60,0.28), transparent 58%)",
    badgeBackground: "rgba(255,247,237,0.9)",
    badgeText: "#9a3412",
    priceBackground: "rgba(124,45,18,0.88)",
    priceText: "#fff7ed",
    providerBackground: "rgba(249,115,22,0.12)",
  },
  Repair: {
    accent: "#dc2626",
    background: "linear-gradient(135deg, rgba(248,113,113,0.24), rgba(254,202,202,0.22) 58%, rgba(255,255,255,0.02))",
    glow: "radial-gradient(circle at top right, rgba(252,165,165,0.26), transparent 58%)",
    badgeBackground: "rgba(254,242,242,0.9)",
    badgeText: "#b91c1c",
    priceBackground: "rgba(127,29,29,0.88)",
    priceText: "#fef2f2",
    providerBackground: "rgba(239,68,68,0.12)",
  },
  Mechanic: {
    accent: "#e11d48",
    background: "linear-gradient(135deg, rgba(244,63,94,0.24), rgba(251,207,232,0.2) 58%, rgba(255,255,255,0.02))",
    glow: "radial-gradient(circle at top right, rgba(251,113,133,0.28), transparent 58%)",
    badgeBackground: "rgba(255,241,242,0.92)",
    badgeText: "#be123c",
    priceBackground: "rgba(136,19,55,0.88)",
    priceText: "#fff1f2",
    providerBackground: "rgba(244,63,94,0.12)",
  },
  default: {
    accent: "#64748b",
    background: "linear-gradient(135deg, rgba(148,163,184,0.2), rgba(226,232,240,0.18) 58%, rgba(255,255,255,0.02))",
    glow: "radial-gradient(circle at top right, rgba(148,163,184,0.22), transparent 58%)",
    badgeBackground: "rgba(248,250,252,0.88)",
    badgeText: "#475569",
    priceBackground: "rgba(51,65,85,0.88)",
    priceText: "#f8fafc",
    providerBackground: "rgba(100,116,139,0.12)",
  },
};

const categories = [
  "All Categories",
  "Repair",
  "Plumbing",
  "Electrician",
  "Cleaning",
  "Mechanic",
  "Carpenter",
];

const locationsList = [
  "Hyderabad",
  "Ramannapet",
  "Ghatkesar",
  "Warangal",
  "Nalgonda",
  "Suryapet",
  "Miryalaguda",
  "Bhongir",
];

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

const formatPrice = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const renderRatingStars = (value, size = 15) =>
  [1, 2, 3, 4, 5].map((star) => (
    <Star
      key={star}
      size={size}
      fill={star <= Math.round(value || 0) ? "#f59e0b" : "transparent"}
      color={star <= Math.round(value || 0) ? "#f59e0b" : "rgba(148,163,184,0.35)"}
    />
  ));

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();

  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [providerRatings, setProviderRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [filters, setFilters] = useState({ category: "", location: "" });
  const [suggestions, setSuggestions] = useState([]);

  const handleLocationChange = (value) => {
    setFilters({ ...filters, location: value });
    setSuggestions(
      value.length > 0
        ? locationsList.filter((loc) =>
            loc.toLowerCase().includes(value.toLowerCase())
          )
        : []
    );
  };

  const load = async () => {
    try {
      const res = await client.get("/services", { params: filters });
      const servicesList = res.data.data?.content || [];
      setServices(servicesList);

      const bookingRes = await client.get("/bookings/me");
      setBookings(bookingRes.data.data || []);

      const ratingMap = {};
      await Promise.all(
        servicesList.map(async (service) => {
          try {
            const stats = await client.get(`/ratings/stats/${service.providerId}`);
            ratingMap[service.providerId] = stats.data;
          } catch {
            ratingMap[service.providerId] = { averageRating: 0, totalReviews: 0 };
          }

          try {
            const reviewRes = await client.get(`/ratings/provider/${service.providerId}`);
            setReviews((prev) => ({ ...prev, [service.providerId]: reviewRes.data }));
          } catch {}
        })
      );

      setProviderRatings(ratingMap);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    load();
  }, [filters]);

  const book = async (serviceId) => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    await client.post("/bookings", {
      serviceId: Number(serviceId),
      serviceDate: today.toISOString().split("T")[0],
      notes: "Booked from dashboard",
    });
    load();
  };

  const overviewCards = useMemo(() => {
    const approvedCount = bookings.filter((booking) => booking.status === "APPROVED").length;
    const completedCount = bookings.filter((booking) => booking.status === "COMPLETED").length;
    const topCategory =
      services.reduce((acc, service) => {
        acc[service.category] = (acc[service.category] || 0) + 1;
        return acc;
      }, {}) || {};

    const mostVisibleCategory =
      Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || "Mixed";

    return [
      {
        label: "Services Available",
        value: services.length,
        meta: "Live results based on your filters",
      },
      {
        label: "My Bookings",
        value: bookings.length,
        meta: `${approvedCount} approved and ${completedCount} completed`,
      },
      {
        label: "Top Category",
        value: mostVisibleCategory,
        meta: "Most visible in the current service feed",
      },
    ];
  }, [bookings, services]);

  const recentBookings = useMemo(() => bookings.slice(0, 4), [bookings]);

  if (selectedProvider) {
    const providerReviews = reviews[selectedProvider] || [];
    const averageRating =
      providerRatings[selectedProvider]?.averageRating?.toFixed(1) || "0.0";

    return (
      <div className="app-page">
        <div
          className="panel"
          style={{
            padding: "28px",
            display: "flex",
            justifyContent: "space-between",
            gap: "18px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <button onClick={() => setSelectedProvider(null)} className="btn-secondary">
              <ArrowLeft size={16} />
              Back
            </button>
            <div>
              <p className="page-kicker">Provider Reviews</p>
              <h1 className="page-title" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
                Customer Feedback
              </h1>
              <p className="page-subtitle">
                {providerReviews.length} review{providerReviews.length === 1 ? "" : "s"} from
                customers who booked this provider.
              </p>
            </div>
          </div>

          <div
            className="panel-soft"
            style={{
              padding: "18px 22px",
              borderRadius: "24px",
              minWidth: "180px",
              textAlign: "center",
            }}
          >
            <p className="page-kicker" style={{ marginBottom: "10px" }}>
              Average Rating
            </p>
            <p style={{ margin: 0, fontSize: "42px", fontWeight: 800 }}>{averageRating}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginTop: "8px" }}>
              {renderRatingStars(Number(averageRating), 18)}
            </div>
          </div>
        </div>

        <div className="panel" style={{ padding: "24px", marginTop: "24px" }}>
          <div className="stat-grid">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = providerReviews.filter((review) => review.stars === star).length;
              const pct = providerReviews.length
                ? (count / providerReviews.length) * 100
                : 0;

              return (
                <div key={star} className="stat-card">
                  <p className="stat-label">{star} Star</p>
                  <div
                    style={{
                      height: "10px",
                      borderRadius: "999px",
                      background: "var(--bg-soft)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        borderRadius: "999px",
                        background: "linear-gradient(135deg, #3b82f6, #14b8a6)",
                      }}
                    />
                  </div>
                  <p className="stat-meta" style={{ marginTop: "10px" }}>
                    {count} review{count === 1 ? "" : "s"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {providerReviews.length === 0 ? (
          <div className="panel empty-state" style={{ marginTop: "24px" }}>
            <Star size={34} color="var(--text-faint)" style={{ margin: "0 auto" }} />
            <h3>No reviews yet</h3>
            <p>This provider has not received customer reviews yet.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
              marginTop: "24px",
            }}
          >
            {providerReviews.map((review) => (
              <div key={review.id} className="panel" style={{ padding: "22px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "14px",
                    alignItems: "flex-start",
                    marginBottom: "14px",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "18px",
                        display: "grid",
                        placeItems: "center",
                        background:
                          "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(20,184,166,0.2))",
                        fontWeight: 800,
                      }}
                    >
                      {review.userName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 800 }}>{review.userName}</p>
                      <p style={{ margin: "4px 0 0", color: "var(--text-secondary)", fontSize: "13px" }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "4px" }}>
                    {renderRatingStars(review.stars, 16)}
                  </div>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                    fontSize: "15px",
                  }}
                >
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-page">
      <div
        className="panel"
        style={{
          padding: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p className="page-kicker">Welcome back</p>
          <h1 className="page-title">{user?.fullName || "User"}</h1>
          <p className="page-subtitle">
            Browse local services, compare providers, and book the help you need with a
            cleaner, more focused dashboard.
          </p>
        </div>

        <button onClick={toggle} className="btn-secondary" title={isDark ? "Light mode" : "Dark mode"}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? "Light" : "Dark"}
        </button>
      </div>

      <div className="stat-grid" style={{ marginTop: "24px" }}>
        {overviewCards.map((card) => (
          <div key={card.label} className="panel" style={{ padding: "22px" }}>
            <p className="stat-label">{card.label}</p>
            <p className="stat-value" style={{ fontSize: typeof card.value === "number" ? "34px" : "28px" }}>
              {card.value}
            </p>
            <p className="stat-meta">{card.meta}</p>
          </div>
        ))}
      </div>

      <div
        className="panel"
        style={{
          padding: "24px",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
            alignItems: "start",
          }}
        >
          <div>
            <label className="field-label">Category</label>
            <div className="field-shell">
              <Tag size={18} color="var(--text-faint)" />
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category === "All Categories" ? "" : category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <label className="field-label">Location</label>
            <div className="field-shell">
              <MapPin size={18} color="var(--text-faint)" />
              <input
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => handleLocationChange(e.target.value)}
              />
            </div>

            {suggestions.length > 0 && (
              <div
                className="notification-popover"
                style={{
                  left: 0,
                  right: "auto",
                  top: "calc(100% + 10px)",
                  width: "100%",
                }}
              >
                <div style={{ padding: "10px", display: "grid", gap: "6px" }}>
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      className="btn-secondary"
                      style={{ width: "100%", justifyContent: "flex-start" }}
                      onClick={() => {
                        setFilters({ ...filters, location: suggestion });
                        setSuggestions([]);
                      }}
                    >
                      <MapPin size={15} />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ alignSelf: "end" }}>
            <button onClick={load} className="btn-primary">
              <Search size={16} />
              Search
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginTop: "24px",
          alignItems: "start",
        }}
      >
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "18px",
            }}
          >
            {services.length === 0 ? (
              <div className="panel empty-state" style={{ gridColumn: "1 / -1" }}>
                <Search size={34} color="var(--text-faint)" style={{ margin: "0 auto" }} />
                <h3>No services found</h3>
                <p>Try a different category or location to discover available providers.</p>
              </div>
            ) : (
              services.map((service) => {
                const theme = CATEGORY_THEMES[service.category] || CATEGORY_THEMES.default;
                const ratingInfo = providerRatings[service.providerId] || {
                  averageRating: 0,
                  totalReviews: 0,
                };

                return (
                  <article
                    key={service.id}
                    className="panel"
                    style={{
                      overflow: "hidden",
                      border: `1px solid ${theme.accent}22`,
                      boxShadow: `0 18px 40px ${theme.accent}14`,
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        padding: "22px",
                        minHeight: "220px",
                        background: theme.background,
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: theme.glow,
                          pointerEvents: "none",
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          top: "18px",
                          right: "18px",
                          padding: "8px 12px",
                          borderRadius: "999px",
                          background: theme.priceBackground,
                          color: theme.priceText,
                          fontWeight: 800,
                          fontSize: "13px",
                          boxShadow: `0 12px 24px ${theme.accent}20`,
                        }}
                      >
                        {formatPrice(service.price)}
                      </div>

                      <div
                        style={{
                          display: "inline-flex",
                          padding: "8px 12px",
                          borderRadius: "999px",
                          background: theme.badgeBackground,
                          color: theme.badgeText,
                          fontSize: "12px",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          boxShadow: `inset 0 0 0 1px ${theme.accent}1f`,
                        }}
                      >
                        {service.category}
                      </div>

                      <img
                        src={getIcon(service)}
                        alt={service.title}
                        style={{
                          width: "120px",
                          height: "120px",
                          margin: "22px auto 0",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <div style={{ padding: "22px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "14px",
                          alignItems: "flex-start",
                        }}
                      >
                        <div>
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
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "14px",
                            }}
                          >
                            <MapPin size={15} />
                            {service.location}
                          </p>
                        </div>

                        <div
                          className="panel-soft"
                          style={{
                            padding: "10px 12px",
                            borderRadius: "18px",
                            textAlign: "center",
                            minWidth: "74px",
                          }}
                        >
                          <p style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>
                            {ratingInfo.averageRating?.toFixed(1) || "0.0"}
                          </p>
                          <p style={{ margin: "2px 0 0", color: "var(--text-faint)", fontSize: "11px" }}>
                            rating
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/provider/${service.providerId}`)}
                        className="btn-ghost"
                        style={{
                          marginTop: "16px",
                          padding: "10px 14px",
                          border: 0,
                          background: theme.providerBackground,
                          color: theme.accent,
                          justifyContent: "flex-start",
                          borderRadius: "999px",
                        }}
                      >
                        <UserRound size={15} />
                        {service.providerName}
                      </button>

                      <button
                        onClick={() => setSelectedProvider(service.providerId)}
                        className="btn-ghost"
                        style={{
                          marginTop: "10px",
                          padding: 0,
                          border: 0,
                          background: "transparent",
                          justifyContent: "flex-start",
                        }}
                      >
                        <span style={{ display: "flex", gap: "4px" }}>
                          {renderRatingStars(ratingInfo.averageRating, 15)}
                        </span>
                        <span style={{ color: "var(--text-secondary)" }}>
                          ({ratingInfo.totalReviews || 0} reviews)
                        </span>
                      </button>

                      <button
                        onClick={() => book(Number(service.id))}
                        className="btn-primary"
                        style={{
                          width: "100%",
                          marginTop: "22px",
                          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)`,
                          boxShadow: `0 16px 28px ${theme.accent}30`,
                        }}
                      >
                        Book Service
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        <aside style={{ display: "grid", gap: "18px" }}>
          <div className="panel" style={{ padding: "22px" }}>
            <p className="page-kicker">Booking Snapshot</p>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                letterSpacing: "-0.04em",
              }}
            >
              Recent activity
            </h2>

            {recentBookings.length === 0 ? (
              <div className="empty-state" style={{ paddingInline: 0 }}>
                <CalendarClock size={30} color="var(--text-faint)" style={{ margin: "0 auto" }} />
                <h3 style={{ fontSize: "22px" }}>No bookings yet</h3>
                <p>Your recent booking activity will appear here once you book a service.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="panel-soft"
                    style={{
                      padding: "16px",
                      borderRadius: "18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontWeight: 800 }}>{booking.serviceTitle}</p>
                        <p
                          style={{
                            margin: "6px 0 0",
                            color: "var(--text-secondary)",
                            fontSize: "13px",
                          }}
                        >
                          {new Date(booking.serviceDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className="panel-soft"
                        style={{
                          padding: "8px 10px",
                          borderRadius: "999px",
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
                ))}
              </div>
            )}
          </div>

          <div className="panel" style={{ padding: "22px" }}>
            <p className="page-kicker">Quick Tips</p>
            <div style={{ display: "grid", gap: "14px", marginTop: "14px" }}>
              {[
                "Use category and location filters together for faster results.",
                "Open provider ratings before booking to compare customer feedback.",
                "Track recent activity from the booking snapshot panel.",
              ].map((tip) => (
                <div key={tip} className="panel-soft" style={{ padding: "16px", borderRadius: "18px" }}>
                  <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {showPayment && selectedBooking && (
        <PaymentModal
          bookingId={selectedBooking.id}
          amount={selectedBooking.price}
          onClose={() => {
            setShowPayment(false);
            setSelectedBooking(null);
            load();
          }}
        />
      )}
    </div>
  );
};

export default UserDashboard;
