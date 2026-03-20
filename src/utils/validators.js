export function validateCardNumber(rawDigits) {
  const value = rawDigits ?? "";

  if (value.length === 0) return "Card number is required.";
  if (/\D/.test(value)) return "Card number must contain digits only.";
  if (value.length !== 16) return "Card number must be 16 digits.";
  if (new Set(value.split("")).size === 1) {
    return "Card number appears invalid. All digits must be different.";
  }

  return "";
}

export function validateCVV(rawDigits) {
  const value = rawDigits ?? "";

  if (value.length === 0) return "CVV is required.";
  if (/\D/.test(value)) return "CVV must contain digits only.";
  if (value.length !== 3) return "CVV must be exactly 3 digits.";

  return "";
}

export function validateExpiryDate(rawDigits) {
  const value = rawDigits ?? "";

  if (value.length === 0) return "Expiry date is required.";
  if (/\D/.test(value)) return "Enter expiry date in MM/YY format.";
  if (value.length !== 4) return "Enter expiry date in MM/YY format.";

  const month = parseInt(value.slice(0, 2), 10);
  const year2 = parseInt(value.slice(2, 4), 10);
  const year = 2000 + year2;

  if (month === 0 || month > 12) {
    return "Month must be between 01 and 12.";
  }

  const now = new Date();
  const endOfExpiryMonth = new Date(year, month, 0, 23, 59, 59, 999);

  if (endOfExpiryMonth.getTime() < now.getTime()) {
    return "Your card has expired.";
  }

  const maxYear = now.getFullYear() + 20;
  if (year > maxYear) {
    return "Please enter a valid expiry year.";
  }

  return "";
}

export function validateCardholderName(value) {
  const v = value ?? "";

  if (v.length === 0) return "Cardholder name is required.";
  if (v.trim().length === 0) return "Please enter a valid name.";
  if (/[^A-Za-z ]/.test(v)) return "Name must contain letters and spaces only.";

  return "";
}
