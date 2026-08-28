import React from "react";
import { Inbox, ServerCrash } from "lucide-react";
import Button from "./Button";
import "./StateDisplays.css";

export function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className="state-display">
      <div className="state-display__icon state-display__icon--muted">
        <Icon size={26} aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  icon: Icon = ServerCrash,
  title = "Unable to load this page",
  message = "Something went wrong while fetching data.",
  actionLabel = "Try again",
  onAction,
}) {
  return (
    <div className="state-display">
      <div className="state-display__icon state-display__icon--error">
        <Icon size={26} aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
