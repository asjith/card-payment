# Payment Gateway UI — Full Specification

> **Status:** Finalized  
> **Stack:** React (JavaScript)  
> **Theme:** Dark / Premium — Deep Navy + Gold  
> **Architecture:** Reusable, config-driven, custom hooks, separation of concerns

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [UI Layout & Design](#2-ui-layout--design)
3. [Field Specifications](#3-field-specifications)
   - 3.1 Card Number
   - 3.2 CVV
   - 3.3 Expiry Date
   - 3.4 Cardholder Name
4. [Validation Rules & Error Messages](#4-validation-rules--error-messages)
5. [Submit Behaviour](#5-submit-behaviour)
6. [Submitted Details Display](#6-submitted-details-display)
7. [Reusability & Config Schema](#7-reusability--config-schema)
8. [Architecture & Folder Structure](#8-architecture--folder-structure)
9. [Custom Hooks](#9-custom-hooks)
10. [Performance Optimizations](#10-performance-optimizations)
11. [Auto-Focus Flow](#11-auto-focus-flow)
12. [Error Display Rules](#12-error-display-rules)

---

## 1. Project Overview

A **reusable, production-grade Payment Card UI** built in React. It accepts four card inputs from the user, validates them, and displays the submitted details below the card. The component is config-driven so new fields can be added without modifying core component logic.

---

## 2. UI Layout & Design

### Card Container
- Card-style layout, centred on screen
- **Theme:** Dark premium — deep navy background (`#0A1628`), gold accents (`#C9A84C`), white text
- Subtle card shadow with a gold border glow
- Responsive — works on desktop and mobile

### Layout Order (top to bottom inside card)
1. Card Number input
2. Row: CVV input | Expiry Date input (side by side)
3. Cardholder Name input
4. Submit Button

### Submitted Details Section
- Rendered **below the card**, not on a new page
- Appears only after a successful submit
- Displays all four field values in a styled summary panel

---

## 3. Field Specifications

### 3.1 Card Number

| Property | Detail |
|---|---|
| Label | Card Number |
| Max Length | 16 digits |
| Display Format | `XXXX XXXX XXXX XXXX` (spaces after every 4 digits) |
| Placeholder Behaviour | X mask — typed digits replace X's one by one; remaining X's stay visible |
| State Storage | Stored as a **contiguous 16-char string** (no spaces) |
| UI Display | Always shows spaces after every 4 characters |
| Input Type | `text` |
| Auto-focus Next | Yes — auto-focuses **CVV** field when 16th digit is entered |
| Allowed Characters | Digits only (0–9); non-numeric input is silently rejected |

**Placeholder Mask Behaviour Detail:**
- Default display: `XXXX XXXX XXXX XXXX`
- User types `4` → display: `4XXX XXXX XXXX XXXX`
- User types `42` → display: `42XX XXXX XXXX XXXX`
- State variable always holds raw digits: e.g. `4242424242424242`
- UI always renders the mask with spaces: e.g. `4242 4242 4242 4242`

---

### 3.2 CVV

| Property | Detail |
|---|---|
| Label | CVV |
| Max Length | Exactly 3 digits |
| Input Type | Password (masked — dots/asterisks) |
| Allowed Characters | Digits only (0–9) |
| Auto-focus Next | Yes — auto-focuses **Expiry Date** field when 3rd digit is entered |
| Extra characters | Blocked — user cannot type beyond 3 characters |

---

### 3.3 Expiry Date

| Property | Detail |
|---|---|
| Label | Expiry Date |
| Format | `MM/YY` |
| Input Type | `text` |
| Max Length | 5 characters including `/` |
| Auto-slash | After 2nd digit of MM is typed, `/` is auto-inserted and cursor moves to YY |
| Auto-focus Next | Yes — auto-focuses **Cardholder Name** field when YY is complete (5 chars total) |
| Allowed Characters | Digits only; `/` is auto-inserted, not manually typed |

**Auto-slash Behaviour Detail:**
- User types `1` → display: `1`
- User types `2` → display: `12/`, cursor placed after `/`
- User types `2` → display: `12/2`
- User types `6` → display: `12/26`, auto-focus moves to Name

---

### 3.4 Cardholder Name

| Property | Detail |
|---|---|
| Label | Cardholder Name |
| Input Type | `text` |
| Allowed Characters | Alphabets (A–Z, a–z) and spaces only |
| Numbers/Symbols | Silently rejected on input |
| Auto-focus Next | N/A (last field) |
| Max Length | No hard limit (reasonable UX cap: 26 characters recommended) |

---

## 4. Validation Rules & Error Messages

> **Rule: Validation triggers ONLY on blur (when the user leaves a field). Never during typing.**

---

### 4.1 Card Number — All Possible Errors

| # | Condition | Error Message |
|---|---|---|
| E1 | Field is empty | "Card number is required." |
| E2 | Contains non-numeric characters | "Card number must contain digits only." |
| E3 | Fewer than 16 digits entered | "Card number must be 16 digits." |
| E4 | All digits are the same (e.g. `1111111111111111`) | "Card number appears invalid. Please check again." |

---

### 4.2 CVV — All Possible Errors

| # | Condition | Error Message |
|---|---|---|
| E1 | Field is empty | "CVV is required." |
| E2 | Fewer than 3 digits | "CVV must be exactly 3 digits." |
| E3 | Contains non-numeric characters | "CVV must contain digits only." |

---

### 4.3 Expiry Date — All Possible Errors

| # | Condition | Error Message |
|---|---|---|
| E1 | Field is empty | "Expiry date is required." |
| E2 | Format is not MM/YY | "Enter expiry date in MM/YY format." |
| E3 | Month is 00 | "Month must be between 01 and 12." |
| E4 | Month is greater than 12 | "Month must be between 01 and 12." |
| E5 | Date is in the past | "Your card has expired." |
| E6 | Year is unrealistically far in the future (> 20 years from now) | "Please enter a valid expiry year." |

---

### 4.4 Cardholder Name — All Possible Errors

| # | Condition | Error Message |
|---|---|---|
| E1 | Field is empty | "Cardholder name is required." |
| E2 | Contains digits or special characters | "Name must contain letters and spaces only." |
| E3 | Only spaces entered (blank after trim) | "Please enter a valid name." |

---

## 5. Submit Behaviour

| Property | Detail |
|---|---|
| Button State | **Disabled** until all four fields pass validation |
| Trigger for enabling | All fields are valid (no active errors, all touched and clean) |
| On click | Runs a final validation pass across all fields, then displays submitted details below |
| Visual cue | Button appears dimmed/greyed when disabled; gold + full opacity when active |

---

## 6. Submitted Details Display

- Rendered **below the card component**, same page
- Appears **only after a successful submit**
- Card Number displayed: **in full** (e.g. `4242 4242 4242 4242`)
- CVV displayed: **masked** (e.g. `***`) — never shown in plain text post-submit for security
- Expiry Date: shown as-is (`MM/YY`)
- Name: shown as entered

### Summary Panel Layout (example)

```
─────────────────────────────
  Payment Details Submitted
─────────────────────────────
  Card Number   :  4242 4242 4242 4242
  CVV           :  ***
  Expiry Date   :  12/26
  Name          :  JOHN DOE
─────────────────────────────
```

---

## 7. Reusability & Config Schema

The card component is **config-driven**. Fields are defined as an **array of field config objects**. This allows new fields to be added by simply extending the array — no changes needed to the core component.

### Why Array of Objects?
- Preserves **render order** (important for tab/focus flow)
- Each object is self-contained — name, type, validation, mask behaviour all co-located
- Easy to map over in JSX
- Simple to extend: push a new object into the array

### Field Config Schema

```js
const fieldConfig = [
  {
    id: "cardNumber",
    label: "Card Number",
    type: "text",
    maxLength: 19,           // 16 digits + 3 spaces
    placeholder: "XXXX XXXX XXXX XXXX",
    mask: "card",            // custom mask type identifier
    autoFocusNext: "cvv",    // id of next field to focus
    validate: validateCardNumber,  // validation function reference
  },
  {
    id: "cvv",
    label: "CVV",
    type: "password",
    maxLength: 3,
    placeholder: "•••",
    mask: null,
    autoFocusNext: "expiryDate",
    validate: validateCVV,
  },
  {
    id: "expiryDate",
    label: "Expiry Date",
    type: "text",
    maxLength: 5,
    placeholder: "MM/YY",
    mask: "expiry",
    autoFocusNext: "cardholderName",
    validate: validateExpiry,
  },
  {
    id: "cardholderName",
    label: "Cardholder Name",
    type: "text",
    maxLength: 26,
    placeholder: "JOHN DOE",
    mask: null,
    autoFocusNext: null,     // last field
    validate: validateName,
  },
];
```

---

## 8. Architecture & Folder Structure

```
src/
├── components/
│   ├── PaymentCard/
│   │   ├── PaymentCard.jsx          # Main card container (renders fields from config)
│   │   ├── PaymentCard.css
│   │   ├── CardField.jsx            # Individual reusable field component
│   │   ├── SubmittedDetails.jsx     # Summary panel rendered below card
│   │   └── index.js                 # Barrel export
│
├── config/
│   └── fieldConfig.js               # Array of field config objects (schema above)
│
├── hooks/
│   ├── useCardForm.js               # Master form state, submit logic, field registry
│   ├── useCardNumber.js             # Card number mask + formatting logic
│   ├── useExpiryDate.js             # Expiry auto-slash + formatting logic
│   └── useFieldValidation.js        # Per-field blur validation, error state
│
├── utils/
│   └── validators.js                # Pure validation functions (no React dependency)
│
└── App.jsx
```

---

## 9. Custom Hooks

### `useCardForm(fieldConfig)`
- Owns the **master form state**: `{ cardNumber, cvv, expiryDate, cardholderName }`
- Tracks **touched state** per field (has the user blurred this field?)
- Tracks **errors** per field
- Exposes `handleChange`, `handleBlur`, `handleSubmit`, `isFormValid`, `submittedData`

### `useCardNumber()`
- Handles the **X-mask replacement** logic
- Converts raw input → display value (with spaces)
- Stores raw digits in state (no spaces)
- Returns `{ displayValue, rawValue, handleCardNumberChange }`

### `useExpiryDate()`
- Handles **auto-slash insertion** after 2nd MM digit
- Manages cursor position
- Returns `{ displayValue, handleExpiryChange }`

### `useFieldValidation(validators)`
- Accepts a map of field IDs → validator functions
- Runs validation **only on blur**
- Returns `{ errors, validateField, validateAll }`

---

## 10. Performance Optimizations

| Technique | Where Applied |
|---|---|
| `React.memo` | `CardField` component — prevents re-render if props haven't changed |
| `useCallback` | All handler functions in `useCardForm` — stable references |
| `useMemo` | `isFormValid` derived state — recomputed only when errors/values change |
| Controlled inputs | All fields are fully controlled with no unnecessary state duplication |
| Separation of concerns | UI (components) / Logic (hooks) / Config (fieldConfig) / Validation (utils) fully separated |

---

## 11. Auto-Focus Flow

```
Card Number (16 digits entered)
        ↓
      CVV (3 digits entered)
        ↓
  Expiry Date (MM/YY complete)
        ↓
 Cardholder Name (manual submit)
        ↓
    Submit Button
```

- Auto-focus is triggered by checking `rawValue.length === maxRawLength` inside `handleChange`
- Focus is moved using `ref` attached to each field, looked up by `autoFocusNext` id from config
- Refs are stored in a `fieldRefs` map keyed by field `id`

---

## 12. Error Display Rules

| Rule | Detail |
|---|---|
| When to show | Only after the field has been **blurred at least once** |
| When NOT to show | Never while the user is actively typing |
| Re-validation | Runs again on every subsequent blur after the first |
| Clearing errors | Error clears as soon as the field passes validation on next blur |
| Submit-time | On submit click, all unblurred fields are force-validated and errors shown |
| Error position | Displayed directly below the respective input field, in a small red/amber text |

---

*End of Specification — `detail.md` v1.0*
