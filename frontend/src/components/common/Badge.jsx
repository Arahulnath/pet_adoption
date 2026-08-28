import React from "react";
import { STATUS_TONE } from "../../constants";
import "./Badge.css";

/**
 * Status badge. Pass either a `tone` directly, or a `status` string that
 * gets looked up in STATUS_TONE (adoptionStatus / requestStatus enums),
 * so every table/card renders status consistently.
 */
export default function Badge({ children, tone, status, dot = true, className = "" }) {
  const resolvedTone = tone || STATUS_TONE[status] || "neutral";
  return (
    <span className={`badge badge--${resolvedTone} ${className}`}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children || status}
    </span>
  );
}
