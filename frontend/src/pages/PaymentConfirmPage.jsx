import { useParams } from "react-router-dom";
import client from "../api/client";

const PaymentConfirmPage = () => {
  const { bookingId, amount } = useParams();

  const confirmPayment = async () => {
    try {
      await client.post("/payments/confirm", {
        bookingId: Number(bookingId),
        amount: Number(amount),
      });

      alert("Payment Confirmed");
    } catch (e) {
      console.log("Payment Error:", e);
      alert("Payment Failed");
    }
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2>UPI Payment</h2>

      <p>Amount: Rs. {amount}</p>

      <p>After completing payment in your UPI app click below.</p>

      <button
        onClick={confirmPayment}
        style={{
          padding: "12px 20px",
          background: "#22c55e",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
        }}
      >
        I Have Paid
      </button>
    </div>
  );
};

export default PaymentConfirmPage;
