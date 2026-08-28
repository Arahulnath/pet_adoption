import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";
import "./ConfirmDialog.css";

/**
 * Confirmation dialog used before every destructive action (SRS 3.6 —
 * "Never immediately delete without confirmation").
 */
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="confirm-dialog">
        {danger && (
          <div className="confirm-dialog__icon">
            <AlertTriangle size={20} />
          </div>
        )}
        <p>{message}</p>
      </div>
    </Modal>
  );
}
