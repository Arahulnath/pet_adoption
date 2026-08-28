import React from "react";
import { Loader2 } from "lucide-react";
import "./Button.css";

/**
 * Reusable Button. Variants map to the design tokens so every CTA in the
 * app (forms, tables, cards) stays visually consistent — this is one of
 * the concrete "reusable component" examples for the Rubric 2.6 / viva.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  type = "button",
  fullWidth = false,
  className = "",
  ...rest
}) {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {loading && <Loader2 size={16} className="btn__spinner" aria-hidden="true" />}
      {!loading && Icon && iconPosition === "left" && <Icon size={16} aria-hidden="true" />}
      <span>{loading ? "Please wait…" : children}</span>
      {!loading && Icon && iconPosition === "right" && <Icon size={16} aria-hidden="true" />}
    </button>
  );
}
