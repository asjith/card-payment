import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useCardNumber from "./useCardNumber";
import useExpiryDate from "./useExpiryDate";
import useFieldValidation from "./useFieldValidation";

function sanitizeCVVInput(raw) {
  return String(raw ?? "").replace(/\D/g, "").slice(0, 3);
}

function sanitizeNameInput(raw) {
  return String(raw ?? "").replace(/[^A-Za-z ]/g, "").slice(0, 26);
}

export default function useCardForm(fieldConfig) {
  const fieldIds = useMemo(() => fieldConfig.map((f) => f.id), [fieldConfig]);

  const validators = useMemo(() => {
    const map = {};
    fieldConfig.forEach((f) => {
      map[f.id] = f.validate;
    });
    return map;
  }, [fieldConfig]);

  const {
    rawValue: cardNumberRaw,
    formattedValue: cardNumberFormatted,
    maskChars: cardNumberMaskChars,
    handleCardNumberChange,
    inputRef: cardInputRef,
  } = useCardNumber();

  const expiryInputRef = useRef(null);
  const {
    rawValue: expiryDateRaw,
    displayValue: expiryDateDisplay,
    handleExpiryChange,
    handleExpiryKeyDown,
  } = useExpiryDate(expiryInputRef);

  const [cvvRaw, setCvvRaw] = useState("");
  const [cardholderNameRaw, setCardholderNameRaw] = useState("");

  const [touched, setTouched] = useState(() => {
    const obj = {};
    fieldIds.forEach((id) => {
      obj[id] = false;
    });
    return obj;
  });

  const { errors, validateField, validateAll } = useFieldValidation(
    validators
  );

  const fieldRefs = useRef({});

  const registerFieldRef = useCallback((id, el) => {
    fieldRefs.current[id] = el;
    if (id === "cardNumber") cardInputRef.current = el;
    if (id === "expiryDate") expiryInputRef.current = el;
  }, [cardInputRef]);

  const focusField = useCallback((id) => {
    const el = fieldRefs.current[id];
    if (el && typeof el.focus === "function") el.focus();
  }, []);

  const valuesRaw = useMemo(
    () => ({
      cardNumber: cardNumberRaw,
      cvv: cvvRaw,
      expiryDate: expiryDateRaw,
      cardholderName: cardholderNameRaw,
    }),
    [cardNumberRaw, cvvRaw, expiryDateRaw, cardholderNameRaw]
  );

  const displayById = useMemo(
    () => ({
      cardNumber: cardNumberFormatted,
      expiryDate: expiryDateDisplay,
    }),
    [cardNumberFormatted, expiryDateDisplay]
  );

  const rawValueById = useMemo(
    () => ({
      cardNumber: cardNumberRaw,
      cvv: cvvRaw,
      expiryDate: expiryDateRaw,
      cardholderName: cardholderNameRaw,
    }),
    [cardNumberRaw, cvvRaw, expiryDateRaw, cardholderNameRaw]
  );

  const isFormValid = useMemo(() => {
    return fieldIds.every((id) => {
      const validator = validators[id];
      return validator ? validator(valuesRaw[id]) === "" : true;
    });
  }, [fieldIds, validators, valuesRaw]);

  const handleBlur = useCallback(
    (id) => {
      setTouched((prev) => ({ ...prev, [id]: true }));
      validateField(id, valuesRaw[id]);
    },
    [validateField, valuesRaw]
  );

  const handlersById = useMemo(() => {
    return {
      cardNumber: handleCardNumberChange,
      cvv: (e) => setCvvRaw(sanitizeCVVInput(e.target.value)),
      expiryDate: handleExpiryChange,
      cardholderName: (e) => setCardholderNameRaw(sanitizeNameInput(e.target.value)),
    };
  }, [handleCardNumberChange, handleExpiryChange]);

  const [submittedData, setSubmittedData] = useState(null);

  const prevCardLenRef = useRef(cardNumberRaw.length);
  const prevCVVLenRef = useRef(cvvRaw.length);
  const prevExpiryLenRef = useRef(expiryDateRaw.length);

  useEffect(() => {
    const prev = prevCardLenRef.current;
    if (prev < 16 && cardNumberRaw.length === 16) focusField("cvv");
    prevCardLenRef.current = cardNumberRaw.length;
  }, [cardNumberRaw.length, focusField]);

  useEffect(() => {
    const prev = prevCVVLenRef.current;
    if (prev < 3 && cvvRaw.length === 3) focusField("expiryDate");
    prevCVVLenRef.current = cvvRaw.length;
  }, [cvvRaw.length, focusField]);

  useEffect(() => {
    const prev = prevExpiryLenRef.current;
    if (prev < 4 && expiryDateRaw.length === 4)
      focusField("cardholderName");
    prevExpiryLenRef.current = expiryDateRaw.length;
  }, [expiryDateRaw.length, focusField]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const { isValid } = validateAll(valuesRaw);

      setTouched(() => {
        const next = {};
        fieldIds.forEach((id) => {
          next[id] = true;
        });
        return next;
      });

      if (!isValid) return;

      setSubmittedData({
        cardNumber: cardNumberRaw,
        cvv: cvvRaw,
        expiryDate: expiryDateDisplay,
        cardholderName: cardholderNameRaw,
      });
    },
    [
      cardNumberRaw,
      cardholderNameRaw,
      cvvRaw,
      expiryDateDisplay,
      fieldIds,
      validateAll,
      valuesRaw,
    ]
  );

  return {
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
  };
}

