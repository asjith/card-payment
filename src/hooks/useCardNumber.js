import { useCallback, useMemo, useRef, useState } from "react";

const MAX_DIGITS = 16;

function formatWithSpaces(digits) {
  if (digits.length === 0) return "";
  const groups = [];
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4));
  }
  return groups.join(" ");
}

function buildMaskChars(digits, formatted) {
  if (digits.length >= MAX_DIGITS) return [];

  const full = "XXXX XXXX XXXX XXXX";
  const result = [];
  for (let i = 0; i < full.length; i++) {
    if (i < formatted.length) {
      result.push({ ch: formatted[i], hidden: true });
    } else {
      result.push({ ch: full[i], hidden: false });
    }
  }
  return result;
}

function digitIndexToFormattedPos(digitIndex) {
  if (digitIndex <= 0) return 0;
  const spacesBefore = Math.floor((digitIndex - 1) / 4);
  return digitIndex + spacesBefore;
}

function formattedPosToDigitIndex(pos, formatted) {
  let digitCount = 0;
  for (let i = 0; i < pos && i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) digitCount++;
  }
  return digitCount;
}

export default function useCardNumber() {
  const [rawValue, setRawValue] = useState("");
  const inputRef = useRef(null);

  const formattedValue = useMemo(
    () => formatWithSpaces(rawValue),
    [rawValue]
  );

  const maskChars = useMemo(
    () => buildMaskChars(rawValue, formattedValue),
    [rawValue, formattedValue]
  );

  const handleCardNumberChange = useCallback((e) => {
    const el = e.target;
    const caretBefore = el.selectionStart ?? 0;
    const oldFormatted = el.value;

    const newDigits = String(el.value ?? "")
      .replace(/\D/g, "")
      .slice(0, MAX_DIGITS);

    const digitsBefore = formattedPosToDigitIndex(caretBefore, oldFormatted);

    setRawValue(newDigits);

    if (newDigits.length === 0) return;

    const newFormatted = formatWithSpaces(newDigits);
    const newCaret = digitIndexToFormattedPos(digitsBefore);
    const clampedCaret = Math.min(newCaret, newFormatted.length);

    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;
      try {
        input.setSelectionRange(clampedCaret, clampedCaret);
      } catch {
        // ignore
      }
    });
  }, []);

  return {
    rawValue,
    formattedValue,
    maskChars,
    handleCardNumberChange,
    inputRef,
  };
}
