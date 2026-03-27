import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Phone, Star, Wrench } from "lucide-react";
import { getProviderProfile, getProviderReviews, getProviderServices } from "../api/providerApi";
import { getImageUrl } from "../utils/image";

const categoryThemes = {
  Cleaning: {
    accent: "#16a34a",
    background: "linear-gradient(135deg, rgba(22,163,74,0.18), rgba(34,197,94,0.08))",
  },
  Electrician: {
    accent: "#0ea5e9",
    background: "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(59,130,246,0.08))",
  },
  Plumbing: {
    accent: "#0284c7",
    background: "linear-gradient(135deg, rgba(2,132,199,0.18), rgba(14,165,233,0.08))",
  },
  Painting: {
    accent: "#8b5cf6",
    background: "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(124,58,237,0.08))",
  },
  Carpentry: {
    accent: "#f97316",
    background: "linear-gradient(135deg, rgba(249,115,22,0.18), rgba(234,88,12,0.08))",
  },
  Repair: {
    accent: "#3b82f6",
    background: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(14,165,233,0.08))",
  },
  Mechanic: {
    accent: "#d946ef",
    background: "linear-gradient(135deg, rgba(217,70,239,0.18), rgba(168,85,247,0.08))",
  },
  Plumber: {
    accent: "#0284c7",
    background: "linear-gradient(135deg, rgba(2,132,199,0.18), rgba(14,165,233,0.08))",
  },
  Carpenter: {
    accent: "#f97316",
    background: "linear-gradient(135deg, rgba(249,115,22,0.18), rgba(234,88,12,0.08))",
  },
  default: {
    accent: "#64748b",
    background: "linear-gradient(135deg, rgba(100,116,139,0.18), rgba(71,85,105,0.08))",
  },
};

const renderRatingStars = (value, size = 15) =>
  [1, 2, 3, 4, 5].map((star) => (
    <Star
      key={star}
      size={size}
      fill={star <= Math.round(value || 0) ? "#f59e0b" : "transparent"}
      color={star <= Math.round(value || 0) ? "#f59e0b" : "rgba(148,163,184,0.35)"}
    />
  ));

const ProviderProfile = () => {
  const { id } = useParams();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      const profileRes = await getProviderProfile(id);
      setProvider(profileRes.data);

      const serviceRes = await getProviderServices(id);
      setServices(serviceRes.data || []);

      const reviewRes = await getProviderReviews(id);
      setReviews(reviewRes.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  const averageRating = useMemo(() => {
    if (!reviews.length) return "0.0";
    return (
      reviews.reduce((sum, review) => sum + Number(review.stars || 0), 0) / reviews.length
    ).toFixed(1);
  }, [reviews]);

  if (!provider) {
    return (
      <div className="app-page">
        <div className="panel empty-state">
          <Wrench size={34} color="var(--text-faint)" style={{ margin: "0 auto" }} />
          <h3>Loading provider</h3>
          <p>Provider profile details are being fetched.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="panel" style={{ padding: "28px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 1.1fr) minmax(220px, 0.6fr)",
            gap: "22px",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
            {provider.profileImage ? (
              <img
                src={getImageUrl(provider.profileImage)}
                alt={provider.fullName}
                style={{
                  width: "108px",
                  height: "108px",
                  borderRadius: "32px",
                  objectFit: "cover",
                  border: "1px solid var(--border-subtle)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "108px",
                  height: "108px",
                  borderRadius: "32px",
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.16), rgba(20,184,166,0.16))",
                  fontSize: "34px",
                  fontWeight: 800,
                }}
              >
                {provider.fullName?.charAt(0)?.toUpperCase() || "P"}
              </div>
            )}

            <div style={{ minWidth: 0 }}>
              <p className="page-kicker">Provider Profile</p>
              <h1 className="page-title" style={{ fontSize: "clamp(2.1rem, 5vw, 3.4rem)" }}>
                {provider.fullName}
              </h1>
              {provider.bio && (
                <p className="page-subtitle" style={{ marginTop: "10px", maxWidth: "700px" }}>
                  {provider.bio}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginTop: "16px",
                }}
              >
                {provider.phone && (
                  <div className="panel-soft" style={{ padding: "10px 14px", borderRadius: "999px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "var(--text-secondary)",
                        fontSize: "14px",
                      }}
                    >
                      <Phone size={15} />
                      {provider.phone}
                    </span>
                  </div>
                )}
                <div className="panel-soft" style={{ padding: "10px 14px", borderRadius: "999px" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                    }}
                  >
                    <Wrench size={15} />
                    {services.length} service{services.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="panel-soft" style={{ padding: "20px", borderRadius: "24px", textAlign: "center" }}>
            <p className="page-kicker" style={{ marginBottom: "10px" }}>
              Customer Rating
            </p>
            <p style={{ margin: 0, fontSize: "42px", fontWeight: 800 }}>{averageRating}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginTop: "8px" }}>
              {renderRatingStars(Number(averageRating), 18)}
            </div>
            <p style={{ margin: "10px 0 0", color: "var(--text-secondary)", fontSize: "14px" }}>
              Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "18px",
          marginTop: "24px",
        }}
      >
        <div className="panel" style={{ padding: "22px" }}>
          <p className="stat-label">Services Offered</p>
          <p className="stat-value">{services.length}</p>
          <p className="stat-meta">Available for customer booking</p>
        </div>
        <div className="panel" style={{ padding: "22px" }}>
          <p className="stat-label">Customer Reviews</p>
          <p className="stat-value">{reviews.length}</p>
          <p className="stat-meta">Feedback entries on profile</p>
        </div>
      </div>

      <div className="panel" style={{ padding: "24px", marginTop: "24px" }}>
        <p className="page-kicker">Services</p>
        <h2
          style={{
            margin: "0 0 18px",
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            letterSpacing: "-0.04em",
          }}
        >
          Services Offered
        </h2>

        {services.length === 0 ? (
          <div className="empty-state" style={{ paddingInline: 0 }}>
            <h3>No services yet</h3>
            <p>This provider has not published any services yet.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
            }}
          >
            {services.map((service) => {
              const theme = categoryThemes[service.category] || categoryThemes.default;

              return (
                <article key={service.id} className="panel-soft" style={{ overflow: "hidden", padding: 0 }}>
                  <div
                    style={{
                      minHeight: "132px",
                      padding: "18px",
                      background: theme.background,
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        padding: "7px 11px",
                        borderRadius: "999px",
                        background: "rgba(255,255,255,0.72)",
                        color: theme.accent,
                        fontSize: "12px",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {service.category}
                    </div>
                  </div>

                  <div style={{ padding: "18px" }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "21px",
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
                    {service.location && (
                      <p
                        style={{
                          margin: "12px 0 0",
                          color: "var(--text-secondary)",
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <MapPin size={15} />
                        {service.location}
                      </p>
                    )}
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
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <div className="panel" style={{ padding: "24px", marginTop: "24px" }}>
        <p className="page-kicker">Reviews</p>
        <h2
          style={{
            margin: "0 0 18px",
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            letterSpacing: "-0.04em",
          }}
        >
          Customer Reviews
        </h2>

        {reviews.length === 0 ? (
          <div className="empty-state" style={{ paddingInline: 0 }}>
            <h3>No reviews yet</h3>
            <p>This provider has not received customer reviews yet.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            {reviews.map((review, index) => (
              <article key={review.id} className="panel-soft" style={{ padding: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "14px",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "18px",
                        display: "grid",
                        placeItems: "center",
                        background:
                          index % 2 === 0
                            ? "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(20,184,166,0.18))"
                            : "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(249,115,22,0.18))",
                        fontWeight: 800,
                      }}
                    >
                      {review.userName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 800 }}>{review.userName}</p>
                      <p style={{ margin: "4px 0 0", color: "var(--text-secondary)", fontSize: "13px" }}>
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>{renderRatingStars(review.stars, 16)}</div>
                </div>
                <p
                  style={{
                    margin: "16px 0 0",
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                    fontSize: "15px",
                  }}
                >
                  "{review.comment}"
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderProfile;
