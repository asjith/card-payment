import { memo } from "react";

const CardField = memo(function CardField({
  id,
  label,
  type,
  placeholder,
  value,
  maxLength,
  inputRef,
  onChange,
  onBlur,
  onKeyDown,
  error,
  showError,
  className,
  maskChars,
}) {
  const isCardNumber = id === "cardNumber";
  const hasMask = Array.isArray(maskChars) && maskChars.length > 0;

  return (
    <div className={`field ${className || ""}`.trim()}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>

      <div className={isCardNumber ? "field-input-wrap" : undefined}>
        <input
          id={id}
          ref={inputRef}
          className="field-input"
          type={type}
          placeholder={isCardNumber ? "" : placeholder}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
        />

        {isCardNumber ? (
          <span className="field-mask-overlay" aria-hidden="true">
            {hasMask
              ? maskChars.map((item, idx) => (
                  <span
                    key={idx}
                    className={item.hidden ? "mask-char-hidden" : "mask-char-visible"}
                  >
                    {item.ch}
                  </span>
                ))
              : null}
          </span>
        ) : null}
      </div>

      {showError && error ? <p className="field-error">{error}</p> : null}
    </div>
  );
});

export default CardField;
