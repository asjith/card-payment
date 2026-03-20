import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function formatExpiryDisplay(rawDigits) {
  const digits = rawDigits ?? "";

  const mm = digits.slice(0, 2);
  const yy = digits.slice(2, 4);

  if (digits.length === 0) return "";
  if (digits.length === 1) return mm;
  if (digits.length === 2) return `${mm}/`;
  if (digits.length === 3) return `${mm}/${yy.slice(0, 1)}`;
  return `${mm}/${yy.slice(0, 2)}`;
}

export default function useExpiryDate(inputRef) {
  const [rawValue, setRawValue] = useState("");
  const displayValue = useMemo(
    () => formatExpiryDisplay(rawValue),
    [rawValue]
  );

  const prevLenRef = useRef(rawValue.length);

  useEffect(() => {
    prevLenRef.current = rawValue.length;
  }, [rawValue.length]);

  const handleExpiryChange = useCallback(
    (e) => {
      const prevLen = prevLenRef.current;

      const digits = String(e.target.value ?? "")
        .replace(/\D/g, "")
        .slice(0, 4);

      setRawValue(digits);

      if (prevLen < 2 && digits.length === 2) {
        requestAnimationFrame(() => {
          const el = inputRef?.current;
          if (!el) return;
          try {
            el.setSelectionRange(3, 3);
          } catch {
            // ignore
          }
        });
      }
    },
    [inputRef]
  );

  const handleExpiryKeyDown = useCallback(
    (e) => {
      if (e.key !== "Backspace") return;

      const el = inputRef?.current;
      if (!el) return;

      const caretPos = el.selectionStart ?? 0;
      if (rawValue.length !== 2) return;

      if (caretPos === 3 && displayValue[caretPos - 1] === "/") {
        e.preventDefault();
        setRawValue((prev) => prev.slice(0, 1));

        requestAnimationFrame(() => {
          const el2 = inputRef?.current;
          if (!el2) return;
          try {
            el2.setSelectionRange(1, 1);
          } catch {
            // ignore
          }
        });
      }
    },
    [displayValue, inputRef, rawValue.length]
  );

  return { rawValue, displayValue, handleExpiryChange, handleExpiryKeyDown };
}

