import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock3,
  CreditCard,
  Inbox,
  Receipt,
  Star,
} from "lucide-react";
import client from "../../api/client";
import PaymentModal from "../../components/PaymentModal";

const STATUS_COLORS = {
  DECLINED: { bg: "rgba(239,68,68,0.12)", text: "#ef4444" },
  APPROVED: { bg: "rgba(59,130,246,0.12)", text: "#3b82f6" },
  COMPLETED: { bg: "rgba(59,130,246,0.12)", text: "#2563eb" },
  CONFIRMED: { bg: "rgba(168,85,247,0.12)", text: "#8b5cf6" },
  PENDING: { bg: "rgba(100,116,139,0.14)", text: "#64748b" },
};

const STAR_PALETTE = {
  1: { label: "Needs Improvement", color: "#ef4444" },
  2: { label: "Fair Service", color: "#ec4899" },
  3: { label: "Good Experience", color: "#64748b" },
  4: { label: "Great Quality", color: "#3b82f6" },
  5: { label: "Exceptional", color: "#14b8a6" },
};

const filters = ["ALL", "PENDING", "APPROVED", "COMPLETED"];

const formatPrice = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedBookings, setReviewedBookings] = useState({});

  const load = async () => {
    try {
      const res = await client.get("/bookings/me");
      const bookingList = res.data.data || [];
      setBookings(bookingList);

      const reviewMap = {};
      await Promise.all(
        bookingList.map(async (booking) => {
          try {
            const check = await client.get(`/ratings/booking/${booking.id}`);
            reviewMap[booking.id] = check.data;
          } catch {
            reviewMap[booking.id] = false;
          }
        })
      );

      setReviewedBookings(reviewMap);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredBookings = useMemo(
    () => bookings.filter((booking) => filter === "ALL" || booking.status === filter),
    [bookings, filter]
  );

  const stats = useMemo(
    () => [
      {
        label: "Total Bookings",
        value: bookings.length,
        meta: "All booking records",
        icon: Receipt,
      },
      {
        label: "Pending",
        value: bookings.filter((booking) => booking.status === "PENDING").length,
        meta: "Waiting for provider response",
        icon: Clock3,
      },
      {
        label: "Completed",
        value: bookings.filter((booking) => booking.status === "COMPLETED").length,
        meta: "Finished services",
        icon: CheckCircle2,
      },
    ],
    [bookings]
  );

  const submitReview = async () => {
    if (!reviewBooking) return;

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      setReviewError("Please enter your feedback before submitting.");
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError("");

      await client.post("/ratings", {
        bookingId: reviewBooking.id,
        stars: rating,
        comment: trimmedComment,
      });

      setComment("");
      setRating(5);
      setReviewError("");
      setReviewBooking(null);
      await load();
    } catch (error) {
      setReviewError(
        error.response?.data?.message || "Failed to submit review. Please try again."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="app-page">
      <div className="panel" style={{ padding: "28px" }}>
        <p className="page-kicker">Booking Management</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "18px",
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 className="page-title">My Bookings</h1>
            <p className="page-subtitle">
              Track service approvals, payment-ready bookings, and completed jobs in one place.
            </p>
          </div>

          <div className="segment">
            {filters.map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`segment-button ${filter === item ? "active" : ""}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ marginTop: "24px" }}>
        {stats.map(({ label, value, meta, icon: Icon }) => (
          <div key={label} className="panel" style={{ padding: "22px" }}>
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

      <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
        {filteredBookings.length === 0 ? (
          <div className="panel empty-state">
            <Inbox size={34} color="var(--text-faint)" style={{ margin: "0 auto" }} />
            <h3>No bookings in this view</h3>
            <p>Bookings that match the selected status will appear here.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const status = STATUS_COLORS[booking.status] || STATUS_COLORS.PENDING;
            const isCompleted = booking.status === "COMPLETED";

            return (
              <article key={booking.id} className="panel" style={{ padding: "24px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto",
                    gap: "18px",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        width: "58px",
                        height: "58px",
                        borderRadius: "20px",
                        display: "grid",
                        placeItems: "center",
                        background: status.bg,
                        color: status.text,
                        flexShrink: 0,
                      }}
                    >
                      <Receipt size={24} />
                    </div>

                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "22px",
                          fontFamily: "var(--font-display)",
                          letterSpacing: "-0.04em",
                        }}
                      >
                        {booking.serviceTitle}
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          gap: "14px",
                          alignItems: "center",
                          flexWrap: "wrap",
                          marginTop: "10px",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "var(--text-secondary)",
                            fontSize: "14px",
                          }}
                        >
                          <Calendar size={16} />
                          {new Date(booking.serviceDate).toLocaleDateString()}
                        </span>

                        <span
                          style={{
                            padding: "8px 12px",
                            borderRadius: "999px",
                            background: status.bg,
                            color: status.text,
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
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "24px",
                        fontWeight: 700,
                        textAlign: "right",
                      }}
                    >
                      {formatPrice(booking.price)}
                    </div>

                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                      {booking.status === "APPROVED" && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowPayment(true);
                          }}
                          className="btn-primary"
                        >
                          <CreditCard size={16} />
                          Pay Now
                        </button>
                      )}

                      {isCompleted && !reviewedBookings[booking.id] && (
                        <button
                          onClick={() => {
                            setReviewBooking(booking);
                            setRating(5);
                            setComment("");
                            setReviewError("");
                          }}
                          className="btn-primary"
                          style={{
                            background: "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(37,99,235,0.92))",
                            boxShadow: "0 14px 28px rgba(37,99,235,0.22)",
                          }}
                        >
                          <Star size={16} />
                          Submit Review
                        </button>
                      )}

                      {reviewedBookings[booking.id] && (
                        <div
                          className="panel-soft"
                          style={{
                            padding: "12px 16px",
                            borderRadius: "999px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                            color: "#16a34a",
                            fontWeight: 800,
                          }}
                        >
                          <CheckCircle2 size={18} />
                          Reviewed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {reviewBooking && (
        <div className="modal-scrim">
          <div className="modal-card" style={{ overflow: "hidden" }}>
            <div
              style={{
                padding: "24px 24px 18px",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <p className="page-kicker" style={{ marginBottom: "8px" }}>
                Leave a Review
              </p>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: "28px",
                  letterSpacing: "-0.04em",
                }}
              >
                Submit Review
              </h2>
              <p
                style={{
                  margin: "10px 0 0",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                }}
              >
                {reviewBooking.serviceTitle} for {formatPrice(reviewBooking.price)}
              </p>
            </div>

            <div style={{ padding: "24px", display: "grid", gap: "18px" }}>
              <div
                className="panel-soft"
                style={{
                  padding: "18px",
                  borderRadius: "22px",
                  display: "grid",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800 }}>Rate your experience</p>
                    <p style={{ margin: "6px 0 0", color: "var(--text-secondary)", fontSize: "14px" }}>
                      Choose the score that best matches the completed service.
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "999px",
                      background: `${STAR_PALETTE[rating].color}18`,
                      color: STAR_PALETTE[rating].color,
                      fontWeight: 800,
                    }}
                  >
                    {STAR_PALETTE[rating].label}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))",
                    gap: "10px",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => setRating(value)}
                      className={value === rating ? "btn-primary" : "btn-secondary"}
                      style={{
                        padding: "14px 10px",
                        flexDirection: "column",
                        gap: "8px",
                        background:
                          value === rating
                            ? `linear-gradient(135deg, ${STAR_PALETTE[rating].color}, ${STAR_PALETTE[rating].color}cc)`
                            : undefined,
                        boxShadow:
                          value === rating ? `0 12px 24px ${STAR_PALETTE[rating].color}26` : "none",
                      }}
                    >
                      <Star
                        size={20}
                        fill={value <= rating ? "#ffffff" : "transparent"}
                        color={value === rating ? "#ffffff" : "rgba(148,163,184,0.65)"}
                      />
                      <span style={{ fontWeight: 800 }}>{value}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                <label className="field-label">Your feedback</label>
                <div className="field-shell" style={{ alignItems: "flex-start", minHeight: "140px" }}>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share what went well or what could be improved."
                    style={{ minHeight: "110px" }}
                  />
                </div>
                {reviewError && (
                  <p style={{ margin: 0, color: "#dc2626", fontSize: "14px", fontWeight: 600 }}>
                    {reviewError}
                  </p>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() => {
                    setReviewBooking(null);
                    setComment("");
                    setRating(5);
                    setReviewError("");
                  }}
                  className="btn-secondary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    background: "rgba(59,130,246,0.1)",
                    borderColor: "rgba(59,130,246,0.22)",
                    color: "var(--text-primary)",
                    fontWeight: 800,
                  }}
                >
                  <ArrowLeft size={16} />
                  Go Back
                </button>

                <button
                  onClick={submitReview}
                  disabled={submittingReview}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default UserBookings;
