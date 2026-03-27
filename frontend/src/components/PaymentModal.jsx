import { useEffect, useState } from "react";
import { CreditCard, QrCode, Smartphone, X } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import client from "../api/client";

const PAYMENT_OPTIONS = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "upi", label: "UPI ID", icon: Smartphone },
  { id: "qr", label: "UPI QR", icon: QrCode },
];

const formatPrice = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const PaymentModal = ({ bookingId, amount, onClose }) => {
  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upi, setUpi] = useState("");

  const baseUrl = window.location.origin;

  useEffect(() => {
    if (!bookingId) return undefined;

    const interval = setInterval(async () => {
      try {
        const res = await client.get(`/payments/status/${bookingId}`);

        if (res.data === "CONFIRMED") {
          alert("Payment Successful");
          onClose();
          window.location.reload();
        }
      } catch (e) {
        console.log(e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bookingId, onClose]);

  const confirmPayment = async () => {
    try {
      await client.post("/payments", {
        bookingId,
        amount,
      });

      alert("Payment Successful");
      onClose();
      window.location.reload();
    } catch (e) {
      console.log("Payment Error:", e.response?.data);
      alert("Payment Failed");
    }
  };

  const handlePayment = async () => {
    if (method === "card") {
      if (!cardNumber || !expiry || !cvv) {
        alert("Please fill card details");
        return;
      }

      await confirmPayment();
    }

    if (method === "upi") {
      if (!upi) {
        alert("Enter UPI ID");
        return;
      }

      await confirmPayment();
    }
  };

  return (
    <div className="modal-scrim">
      <div className="modal-card" style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "24px 24px 18px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div>
            <p className="page-kicker" style={{ marginBottom: "8px" }}>
              Secure Payment
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                letterSpacing: "-0.04em",
              }}
            >
              Complete Payment
            </h2>
            <p
              style={{
                margin: "10px 0 0",
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
            >
              Booking #{bookingId} for {formatPrice(amount)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ width: "44px", height: "44px", padding: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "24px", display: "grid", gap: "18px" }}>
          <div className="segment" style={{ width: "100%" }}>
            {PAYMENT_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setMethod(option.id)}
                  className={`segment-button ${method === option.id ? "active" : ""}`}
                  style={{
                    flex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <Icon size={15} />
                  {option.label}
                </button>
              );
            })}
          </div>

          {method === "card" && (
            <div style={{ display: "grid", gap: "14px" }}>
              <div className="field-shell">
                <CreditCard size={18} color="var(--text-faint)" />
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div className="field-shell">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>
                <div className="field-shell">
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
              <button onClick={handlePayment} className="btn-primary" style={{ width: "100%" }}>
                Pay {formatPrice(amount)}
              </button>
            </div>
          )}

          {method === "upi" && (
            <div style={{ display: "grid", gap: "14px" }}>
              <div className="field-shell">
                <Smartphone size={18} color="var(--text-faint)" />
                <input
                  type="text"
                  placeholder="example@upi"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                />
              </div>
              <button onClick={handlePayment} className="btn-primary" style={{ width: "100%" }}>
                Pay {formatPrice(amount)}
              </button>
            </div>
          )}

          {method === "qr" && (
            <div
              className="panel-soft"
              style={{
                padding: "24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "220px",
                  height: "220px",
                  margin: "0 auto 18px",
                  padding: "20px",
                  borderRadius: "24px",
                  background: "#fff",
                }}
              >
                <QRCodeCanvas
                  value={bookingId ? `${baseUrl}/payment-confirm/${bookingId}/${amount}` : ""}
                  size={180}
                />
              </div>
              <h3
                style={{
                  margin: "0 0 8px",
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                }}
              >
                Scan To Pay
              </h3>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "14px" }}>
                Open any UPI app on your phone and scan the code to continue.
              </p>
            </div>
          )}

          <button onClick={onClose} className="btn-ghost" style={{ width: "100%" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
