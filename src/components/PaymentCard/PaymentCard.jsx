import { useMemo } from "react";
import "./PaymentCard.css";
import fieldConfig from "../../config/fieldConfig";
import useCardForm from "../../hooks/useCardForm";
import CardField from "./CardField";
import SubmittedDetails from "./SubmittedDetails";

export default function PaymentCard() {
  const {
    errors,
    touched,
    isFormValid,
    displayById,
    rawValueById,
    handlersById,
    handleBlur,
    handleSubmit,
    handleExpiryKeyDown,
    registerFieldRef,
    submittedData,
    cardNumberMaskChars,
  } = useCardForm(fieldConfig);

  const fields = useMemo(() => fieldConfig, []);

  return (
    <div className="payment-page">
      <div className="payment-card-shell">
        <form className="payment-form" onSubmit={handleSubmit}>
          {fields.map((field) => {
            const value =
              displayById[field.id] !== undefined
                ? displayById[field.id]
                : rawValueById[field.id];

            const handler = handlersById[field.id];

            return (
              <CardField
                key={field.id}
                id={field.id}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                value={value}
                maxLength={field.maxLength}
                inputRef={(el) => registerFieldRef(field.id, el)}
                onChange={handler}
                onBlur={() => handleBlur(field.id)}
                onKeyDown={
                  field.id === "expiryDate" ? handleExpiryKeyDown : undefined
                }
                error={errors[field.id]}
                showError={touched[field.id]}
                className={field.layoutClassName}
                maskChars={field.id === "cardNumber" ? cardNumberMaskChars : undefined}
              />
            );
          })}

          <button
            type="submit"
            className="payment-submit"
            disabled={!isFormValid}
          >
            Submit
          </button>
        </form>
      </div>

      {submittedData ? <SubmittedDetails data={submittedData} /> : null}
    </div>
  );
}

