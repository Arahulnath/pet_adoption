import React from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import "./Toast.css";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

export default function ToastViewport({ toasts, onDismiss }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="toast-viewport" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info;
        return (
          <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
            <Icon size={18} className="toast__icon" aria-hidden="true" />
            <p className="toast__message">{toast.message}</p>
            <button
              className="toast__close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
