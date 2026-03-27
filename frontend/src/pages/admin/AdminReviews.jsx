import { useEffect, useMemo, useState } from "react";
import { MessageSquareQuote, Star, Trash2 } from "lucide-react";
import client from "../../api/client";
import DataTableCard from "../../components/dashboard/DataTableCard";

const statSurfaces = [
  "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(236,72,153,0.1))",
  "linear-gradient(135deg, rgba(20,184,166,0.18), rgba(59,130,246,0.1))",
  "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(56,189,248,0.1))",
];

const renderStars = (value, size = 15) =>
  [1, 2, 3, 4, 5].map((star) => (
    <Star
      key={star}
      size={size}
      fill={star <= (value || 0) ? "#f59e0b" : "transparent"}
      color={star <= (value || 0) ? "#f59e0b" : "rgba(148,163,184,0.35)"}
    />
  ));

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await client.get("/ratings/admin");
        setReviews(res.data || []);
      } catch (err) {
        console.log("Reviews load error", err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await client.delete(`/ratings/${id}`);
      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (err) {
      console.log("Delete review error", err);
    }
  };

  const stats = useMemo(
    () => [
      {
        label: "Reviews",
        value: reviews.length,
        meta: "All stored ratings and comments",
        accent: "#a855f7",
      },
      {
        label: "Average Stars",
        value: reviews.length
          ? (reviews.reduce((sum, review) => sum + Number(review.stars || 0), 0) / reviews.length).toFixed(1)
          : "0.0",
        meta: "Across all review entries",
        accent: "#14b8a6",
      },
      {
        label: "With Comments",
        value: reviews.filter((review) => review.comment?.trim()).length,
        meta: "Ratings that include written feedback",
        accent: "#3b82f6",
      },
    ],
    [reviews]
  );

  const ratingBreakdown = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: reviews.filter((review) => Number(review.stars || 0) === rating).length,
      })),
    [reviews]
  );

  const highlightedReviews = useMemo(
    () =>
      [...reviews]
        .filter((review) => review.comment?.trim())
        .sort((a, b) => Number(b.stars || 0) - Number(a.stars || 0))
        .slice(0, 3),
    [reviews]
  );

  const columns = [
    { key: "index", label: "#", render: (_, index) => index + 1 },
    {
      key: "providerId",
      label: "Provider",
      render: (row) => (
        <div>
          <p style={{ margin: 0, fontWeight: 700 }}>Provider #{row.providerId || "-"}</p>
          <p style={{ margin: "4px 0 0", color: "var(--text-faint)", fontSize: "12px" }}>
            Reviewed service owner
          </p>
        </div>
      ),
    },
    {
      key: "userId",
      label: "User",
      render: (row) => (
        <div>
          <p style={{ margin: 0, fontWeight: 700 }}>User #{row.userId || "-"}</p>
          <p style={{ margin: "4px 0 0", color: "var(--text-faint)", fontSize: "12px" }}>
            Review author
          </p>
        </div>
      ),
    },
    {
      key: "stars",
      label: "Stars",
      render: (row) => (
        <div style={{ display: "flex", gap: "4px" }}>
          {renderStars(row.stars, 15)}
        </div>
      ),
    },
    {
      key: "comment",
      label: "Comment",
      render: (row) => (
        <div style={{ maxWidth: "360px" }}>
          <p style={{ margin: 0, lineHeight: 1.7 }}>{row.comment || "-"}</p>
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <button onClick={() => deleteReview(row.id)} className="btn-danger" style={{ padding: "10px 12px" }}>
          <Trash2 size={14} />
          Delete
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="app-page">
        <div className="panel empty-state">
          <MessageSquareQuote size={34} color="var(--text-faint)" style={{ margin: "0 auto" }} />
          <h3>Loading reviews</h3>
          <p>Review records are being fetched from the backend.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div
        className="panel"
        style={{
          padding: "30px",
          background:
            "linear-gradient(135deg, rgba(168,85,247,0.16), rgba(59,130,246,0.08) 38%, rgba(255,255,255,0.02))",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
            alignItems: "stretch",
          }}
        >
          <div>
            <p className="page-kicker">Moderation</p>
            <h1 className="page-title">Reviews</h1>
            <p className="page-subtitle">
              Monitor customer sentiment, surface written feedback quickly, and remove problematic entries when needed.
            </p>
          </div>

          <div className="panel-soft" style={{ padding: "20px", borderRadius: "22px" }}>
            <p className="stat-label">Moderation Focus</p>
            <p style={{ margin: "8px 0 0", fontSize: "28px", fontWeight: 800 }}>
              {reviews.filter((review) => review.comment?.trim()).length}
            </p>
            <p style={{ margin: "8px 0 0", color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.7 }}>
              Written reviews available for deeper quality checks and manual moderation.
            </p>
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ marginTop: "24px" }}>
        {stats.map((card, index) => (
          <div key={card.label} className="panel" style={{ padding: "22px", background: statSurfaces[index] }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <p className="stat-label">{card.label}</p>
                <p className="stat-value">{card.value}</p>
                <p className="stat-meta">{card.meta}</p>
              </div>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "18px",
                  display: "grid",
                  placeItems: "center",
                  background: `${card.accent}22`,
                  color: card.accent,
                  flexShrink: 0,
                }}
              >
                <MessageSquareQuote size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "18px",
          marginTop: "24px",
        }}
      >
        <div className="panel" style={{ padding: "24px" }}>
          <p className="page-kicker">Sentiment Mix</p>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              letterSpacing: "-0.04em",
            }}
          >
            Rating breakdown
          </h2>
          <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
            {ratingBreakdown.map(({ rating, count }) => {
              const width = reviews.length ? `${(count / reviews.length) * 100}%` : "0%";

              return (
                <div key={rating}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 700 }}>{rating} Star</span>
                      <span style={{ display: "flex", gap: "3px" }}>{renderStars(rating, 13)}</span>
                    </div>
                    <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{count}</span>
                  </div>
                  <div
                    style={{
                      height: "10px",
                      borderRadius: "999px",
                      background: "rgba(148,163,184,0.14)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width,
                        height: "100%",
                        borderRadius: "999px",
                        background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel" style={{ padding: "24px" }}>
          <p className="page-kicker">Review Highlights</p>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              letterSpacing: "-0.04em",
            }}
          >
            Written feedback
          </h2>
          <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
            {highlightedReviews.length === 0 ? (
              <div className="panel-soft" style={{ padding: "18px", borderRadius: "18px" }}>
                <p style={{ margin: 0, fontWeight: 700 }}>No written reviews yet</p>
                <p style={{ margin: "8px 0 0", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "14px" }}>
                  Star ratings will still appear in the moderation table below as soon as they are submitted.
                </p>
              </div>
            ) : (
              highlightedReviews.map((review) => (
                <div
                  key={review.id}
                  className="panel-soft"
                  style={{
                    padding: "18px",
                    borderRadius: "18px",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 800 }}>
                        Provider #{review.providerId || "-"} • User #{review.userId || "-"}
                      </p>
                      <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
                        {renderStars(review.stars, 15)}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="btn-danger"
                      style={{ padding: "10px 12px", flexShrink: 0 }}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                  <p style={{ margin: "12px 0 0", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <DataTableCard
          kicker="Moderation Queue"
          title="All Reviews"
          subtitle="Review text and ratings submitted by users."
          columns={columns}
          rows={reviews}
          accent="#a855f7"
          headerActions={
            <div className="panel-soft" style={{ padding: "10px 14px", borderRadius: "16px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Avg. Rating
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 800 }}>
                {reviews.length
                  ? (reviews.reduce((sum, review) => sum + Number(review.stars || 0), 0) / reviews.length).toFixed(1)
                  : "0.0"}
              </p>
            </div>
          }
          emptyTitle="No reviews found"
          emptyMessage="Reviews will appear here after users submit feedback."
        />
      </div>
    </div>
  );
};

export default AdminReviews;
