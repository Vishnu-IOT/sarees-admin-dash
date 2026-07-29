import React from "react";
import "./Dialog.css";

function Dialog({
  isOpen,
  title,
  message,
  type = "confirm", // 'confirm', 'alert', 'form'
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  children,
  isDangerous = false,
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="dialog__overlay" onClick={onCancel} />
      <div className={`dialog ${isDangerous ? "dialog--dangerous" : ""}`}>
        <div className="dialog__header">
          <h2 className="dialog__title">{title}</h2>
          <button
            className="dialog__close"
            onClick={onCancel}
            aria-label="Close dialog"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <div className="dialog__content">
          {message && <p className="dialog__message">{message}</p>}
          {children}
        </div>

        <div className="dialog__footer">
          <button
            className="dialog__btn dialog__btn--secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`dialog__btn dialog__btn--primary ${isDangerous ? "dialog__btn--danger" : ""}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </>
  );
}

export default Dialog;
