import { useEffect, useMemo, useState } from "react";
import { MessageSquareQuote, Star } from "lucide-react";
import client from "../../api/client";

const reviewGradients = [
  "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(20,184,166,0.18))",
  "linear-gradient(135deg, rgba(249,115,22,0.18), rgba(239,68,68,0.18))",
  "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(59,130,246,0.18))",
  "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(14,165,233,0.18))",
];

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.get("/ratings/my-reviews");
        setReviews(res.data || []);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);

  const averageRating = useMemo(() => {
    if (!reviews.length) return "0.0";
    const total = reviews.reduce((sum, review) => sum + Number(review.stars || 0), 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <div className="app-page">
      <div className="panel" style={{ padding: "28px" }}>
        <p className="page-kicker">Service Feedback</p>
        <h1 className="page-title">Your Reviews</h1>
        <p className="page-subtitle">
          A record of the ratings and feedback you have shared after completed services.
        </p>
      </div>

      <div className="stat-grid" style={{ marginTop: "24px" }}>
        {[
          {
            label: "Reviews Submitted",
            value: reviews.length,
            meta: "All customer feedback entries",
          },
          {
            label: "Average Rating",
            value: averageRating,
            meta: "Across your submitted reviews",
          },
        ].map((card) => (
          <div key={card.label} className="panel" style={{ padding: "22px" }}>
            <p className="stat-label">{card.label}</p>
            <p className="stat-value">{card.value}</p>
            <p className="stat-meta">{card.meta}</p>
          </div>
        ))}
      </div>

      {reviews.length === 0 ? (
        <div className="panel empty-state" style={{ marginTop: "24px" }}>
          <MessageSquareQuote size={34} color="var(--text-faint)" style={{ margin: "0 auto" }} />
          <h3>No reviews yet</h3>
          <p>When you review completed services, they will appear here for quick reference.</p>
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
          {reviews.map((review, index) => (
            <article key={review.id} className="panel" style={{ padding: "22px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "14px",
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
                      background: reviewGradients[index % reviewGradients.length],
                      fontWeight: 800,
                    }}
                  >
                    {review.userName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800 }}>{review.userName || "Customer"}</p>
                    <p style={{ margin: "4px 0 0", color: "var(--text-secondary)", fontSize: "13px" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="panel-soft" style={{ padding: "8px 10px", borderRadius: "999px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontWeight: 800 }}>{review.stars}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "4px", marginTop: "18px" }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    size={16}
                    fill={value <= review.stars ? "#f59e0b" : "transparent"}
                    color={value <= review.stars ? "#f59e0b" : "rgba(148,163,184,0.35)"}
                  />
                ))}
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
  );
};

export default UserReviews;
