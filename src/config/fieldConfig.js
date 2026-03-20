import {
  validateCardNumber,
  validateCVV,
  validateExpiryDate,
  validateCardholderName,
} from "../utils/validators";

const fieldConfig = [
  {
    id: "cardNumber",
    label: "Card Number",
    type: "text",
    maxLength: 19,
    placeholder: "XXXX XXXX XXXX XXXX",
    validate: validateCardNumber,
    layoutClassName: "field--full",
  },
  {
    id: "cvv",
    label: "CVV",
    type: "password",
    maxLength: 3,
    placeholder: "•••",
    validate: validateCVV,
    layoutClassName: "field--half",
  },
  {
    id: "expiryDate",
    label: "Expiry Date",
    type: "text",
    maxLength: 5,
    placeholder: "MM/YY",
    validate: validateExpiryDate,
    layoutClassName: "field--half",
  },
  {
    id: "cardholderName",
    label: "Cardholder Name",
    type: "text",
    maxLength: 26,
    placeholder: "JOHN DOE",
    validate: validateCardholderName,
    layoutClassName: "field--full",
  },
];

export default fieldConfig;
