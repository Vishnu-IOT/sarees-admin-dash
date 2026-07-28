import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import "./StatusModal.css";

// Matches the ENUM on the backend Order model exactly.
export const ORDER_STATUSES = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

// A proper overlay for updating an order's status — replaces the old
// window.prompt() flow. Used from both the Orders list (quick action)
// and the Order Detail page.
function UpdateStatusModal({ order, onClose, onUpdated }) {
  const { changeOrderStatus } = useData();
  const [selected, setSelected] = useState(order.status || "Pending");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await changeOrderStatus(order.id, selected);
      if (onUpdated) onUpdated(selected);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't update order status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="status-modal__overlay" onClick={onClose}>
      <div className="status-modal" onClick={(e) => e.stopPropagation()}>
        <div className="status-modal__header">
          <div>
            <h2 className="status-modal__title">Update Order Status</h2>
            <p className="status-modal__subtitle">
              #{order.orderNumber || `ORD-${order.id}`}
            </p>
          </div>
          <button className="status-modal__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="status-modal__body">
          <label className="status-modal__label">Select new status</label>
          <div className="status-modal__options">
            {ORDER_STATUSES.map((status) => (
              <button
                key={status}
                className={`status-modal__option ${selected === status ? "status-modal__option--active" : ""} ${
                  status === "Cancelled" ? "status-modal__option--cancelled" : ""
                }`}
                onClick={() => setSelected(status)}
              >
                <span className="status-modal__dot" />
                {status}
              </button>
            ))}
          </div>

          {error && <p className="status-modal__error">{error}</p>}
        </div>

        <div className="status-modal__footer">
          <button className="status-modal__btn status-modal__btn--outline" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            className="status-modal__btn status-modal__btn--primary"
            onClick={handleSave}
            disabled={saving || selected === order.status}
          >
            {saving ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateStatusModal;
