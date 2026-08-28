// Small, dependency-free validation helpers. Kept separate from
// components so validation rules are unit-testable and reusable across
// every form (login, register, pet form, adoption request form).

export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim().length > 0;

export const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

export const isValidPhone = (value) =>
  /^[+]?[\d\s()-]{7,20}$/.test(String(value || "").trim());

export const minLength = (value, len) => String(value || "").trim().length >= len;

export const maxLength = (value, len) => String(value || "").trim().length <= len;

export const isPositiveNumber = (value) => {
  const n = Number(value);
  return !Number.isNaN(n) && n >= 0;
};

export const isValidPassword = (value) =>
  // At least 8 chars, one letter and one number — matches SRS "strong
  // password policy" requirement (FR7) without being overly restrictive.
  /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(String(value || ""));

/**
 * Runs a map of { field: [validatorFns] } against a values object and
 * returns { field: "error message" } for the first failing rule per field.
 * Each validator entry is { test: fn, message: string }.
 */
export function validateForm(values, schema) {
  const errors = {};
  Object.entries(schema).forEach(([field, rules]) => {
    for (const rule of rules) {
      if (!rule.test(values[field], values)) {
        errors[field] = rule.message;
        break;
      }
    }
  });
  return errors;
}
