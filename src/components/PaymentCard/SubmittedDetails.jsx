export default function SubmittedDetails({ data }) {
  const digits = String(data.cardNumber ?? "").replace(/\D/g, "").slice(0, 16);
  const groups = [];
  for (let i = 0; i < 4; i++) {
    groups.push(digits.slice(i * 4, i * 4 + 4));
  }
  const formattedCardNumber = groups.join(" ");

  return (
    <div className="submitted-panel" aria-live="polite">
      <div className="submitted-title">Payment Details Submitted</div>

      <div className="submitted-row">
        <span className="submitted-label">Card Number</span>
        <span className="submitted-value">{formattedCardNumber}</span>
      </div>

      <div className="submitted-row">
        <span className="submitted-label">CVV</span>
        <span className="submitted-value">{data.cvv}</span>
      </div>

      <div className="submitted-row">
        <span className="submitted-label">Expiry Date</span>
        <span className="submitted-value">{data.expiryDate}</span>
      </div>

      <div className="submitted-row">
        <span className="submitted-label">Name</span>
        <span className="submitted-value">{data.cardholderName}</span>
      </div>
    </div>
  );
}

