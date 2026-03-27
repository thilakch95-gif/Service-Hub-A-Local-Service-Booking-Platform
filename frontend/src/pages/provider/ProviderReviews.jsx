import { useEffect, useMemo, useState } from "react";
import { MessageSquareQuote, Star } from "lucide-react";
import client from "../../api/client";

const ProviderReviews = () => {
  const [ratings, setRatings] = useState([]);
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalReviews: 0,
  });

  const load = async () => {
    try {
      const stats = await client.get("/ratings/stats/me");
      setRatingStats(stats.data || {});

      const rev = await client.get("/ratings/provider/me");
      setRatings(rev.data || []);
    } catch (err) {
      console.log("Provider load error:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const statCards = useMemo(
    () => [
      {
        label: "Average Rating",
        value: Number(ratingStats.averageRating || 0).toFixed(1),
        meta: "Current provider rating",
      },
      {
        label: "Total Reviews",
        value: ratingStats.totalReviews || 0,
        meta: "Customer feedback count",
      },
    ],
    [ratingStats]
  );

  return (
    <div className="app-page">
      <div className="panel" style={{ padding: "28px" }}>
        <p className="page-kicker">Customer Feedback</p>
        <h1 className="page-title">Provider Reviews</h1>
        <p className="page-subtitle">
          See how customers rate your work and review the comments tied to completed jobs.
        </p>
      </div>

      <div className="stat-grid" style={{ marginTop: "24px" }}>
        {statCards.map((card) => (
          <div key={card.label} className="panel" style={{ padding: "22px" }}>
            <p className="stat-label">{card.label}</p>
            <p className="stat-value">{card.value}</p>
            <p className="stat-meta">{card.meta}</p>
          </div>
        ))}
      </div>

      {ratings.length === 0 ? (
        <div className="panel empty-state" style={{ marginTop: "24px" }}>
          <MessageSquareQuote size={34} color="var(--text-faint)" style={{ margin: "0 auto" }} />
          <h3>No reviews yet</h3>
          <p>Reviews from customers will appear here after completed and rated bookings.</p>
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
          {ratings.map((review, index) => (
            <article key={review.id} className="panel" style={{ padding: "22px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "14px",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
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

export default ProviderReviews;
