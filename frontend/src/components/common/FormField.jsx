import React from "react";
import "./FormField.css";

function FieldWrapper({ label, htmlFor, error, hint, required, children }) {
  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      {label && (
        <label htmlFor={htmlFor} className="field__label">
          {label}
          {required && <span className="field__required" aria-hidden="true"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="field__message field__message--error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field__message">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({
  label,
  name,
  error,
  hint,
  required,
  icon: Icon,
  className = "",
  ...rest
}) {
  return (
    <FieldWrapper label={label} htmlFor={name} error={error} hint={hint} required={required}>
      <div className={`field__control ${Icon ? "field__control--icon" : ""}`}>
        {Icon && <Icon size={16} className="field__icon" aria-hidden="true" />}
        <input
          id={name}
          name={name}
          className={`field__input ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          {...rest}
        />
      </div>
    </FieldWrapper>
  );
}

export function Textarea({ label, name, error, hint, required, rows = 4, className = "", ...rest }) {
  return (
    <FieldWrapper label={label} htmlFor={name} error={error} hint={hint} required={required}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={`field__input field__textarea ${className}`}
        aria-invalid={Boolean(error)}
        {...rest}
      />
    </FieldWrapper>
  );
}

export function Select({
  label,
  name,
  error,
  hint,
  required,
  options = [],
  placeholder = "Select…",
  className = "",
  ...rest
}) {
  return (
    <FieldWrapper label={label} htmlFor={name} error={error} hint={hint} required={required}>
      <select
        id={name}
        name={name}
        className={`field__input field__select ${className}`}
        aria-invalid={Boolean(error)}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) =>
          typeof opt === "string" ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
    </FieldWrapper>
  );
}
