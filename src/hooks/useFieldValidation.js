import { useCallback, useMemo, useState } from "react";

export default function useFieldValidation(validators) {
  const fieldIds = useMemo(() => Object.keys(validators), [validators]);

  const initialErrors = useMemo(() => {
    const obj = {};
    fieldIds.forEach((id) => {
      obj[id] = "";
    });
    return obj;
  }, [fieldIds]);

  const [errors, setErrors] = useState(initialErrors);

  const validateField = useCallback(
    (id, value) => {
      const validator = validators[id];
      const msg = validator ? validator(value) : "";
      setErrors((prev) => ({ ...prev, [id]: msg }));
      return msg;
    },
    [validators]
  );

  const validateAll = useCallback(
    (values) => {
      const nextErrors = {};
      fieldIds.forEach((id) => {
        const validator = validators[id];
        nextErrors[id] = validator ? validator(values[id]) : "";
      });

      setErrors(nextErrors);
      const isValid = !Object.values(nextErrors).some(Boolean);
      return { nextErrors, isValid };
    },
    [fieldIds, validators]
  );

  return { errors, validateField, validateAll };
}

