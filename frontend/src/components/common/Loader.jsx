import React from "react";
import { PawPrint } from "lucide-react";
import "./Loader.css";

export function Loader({ label = "Loading…", size = "md" }) {
  return (
    <div className={`loader loader--${size}`} role="status" aria-live="polite">
      <PawPrint className="loader__paw" size={size === "sm" ? 18 : 28} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function Skeleton({ width, height = 16, radius = 6, className = "" }) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton height={160} radius={12} />
      <div className="skeleton-card__body">
        <Skeleton width="70%" height={18} />
        <Skeleton width="45%" height={14} />
        <Skeleton width="90%" height={14} />
      </div>
    </div>
  );
}

export function SkeletonRow({ columns = 5 }) {
  return (
    <tr className="skeleton-row">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i}>
          <Skeleton width={i === 0 ? "80%" : "60%"} />
        </td>
      ))}
    </tr>
  );
}
