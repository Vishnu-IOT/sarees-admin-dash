import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./OrderDetail.css";

const STATUS_STEPS = ["Order Placed", "Payment Confirmed", "Processing", "Shipped", "Delivered"];

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { orders, ordersLoading, changeOrderStatus } = useData();
  const [updating, setUpdating] = useState(false);

  const order = orders.find((o) => String(o.id) === String(id));

  const normalizeStatus = (str) => {
    if (!str) return "Pending";
    const lower = str.trim().toLowerCase();
    if (lower === "pending") return "Pending";
    if (lower === "confirmed") return "Confirmed";
    if (lower === "packed" || lower === "processing") return "Packed";
    if (lower === "shipped") return "Shipped";
    if (lower === "delivered") return "Delivered";
    if (lower === "cancelled" || lower === "canceled") return "Cancelled";
    return str.trim().charAt(0).toUpperCase() + str.trim().slice(1);
  };

  const handleUpdateStatus = async () => {
    const next = window.prompt(
      `Enter new status for #ORD-${id} (Pending, Confirmed, Packed, Shipped, Delivered, Cancelled):`,
      order?.status || "Confirmed"
    );
    if (!next) return;
    setUpdating(true);
    try {
      await changeOrderStatus(id, normalizeStatus(next));
    } catch (err) {
      window.alert(err.response?.data?.message || "Couldn't update order status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm(`Cancel order #ORD-${id}?`)) return;
    setUpdating(true);
    try {
      await changeOrderStatus(id, "Cancelled");
    } catch (err) {
      window.alert(err.response?.data?.message || "Couldn't cancel this order.");
    } finally {
      setUpdating(false);
    }
  };

  if (ordersLoading) {
    return <p className="order-detail__loading">Loading order...</p>;
  }

  if (!order) {
    return (
      <div className="order-detail__not-found">
        <p>Order #ORD-{id} wasn't found.</p>
        <button className="order-detail__btn order-detail__btn--outline" onClick={() => navigate("/orders")}>
          ← Back to Orders
        </button>
      </div>
    );
  }

  const items = order.items || order.orderItems || [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || item.product?.price || 0) * Number(item.qty || item.quantity || 1),
    0
  );
  const shippingFee = order.shippingFee || 0;
  const taxes = order.taxes || Math.round(subtotal * 0.05);
  const total = order.total || order.totalAmount || subtotal + shippingFee + taxes;

  const currentStepIndex = Math.max(STATUS_STEPS.findIndex(
    (step) => step.toLowerCase().replace(/\s+/g, "_") === (order.status || "").toLowerCase()
  ), 0);

  return (
    <div className="order-detail">
      <button className="order-detail__back" onClick={() => navigate("/orders")}>
        ← Order Management
      </button>

      <div className="order-detail__header">
        <div>
          <div className="order-detail__heading-row">
            <h1 className="order-detail__id">#ORD-{order.id}</h1>
            <span className={`order-detail__badge order-detail__badge--${(order.status || "pending").toLowerCase()}`}>
              {order.status || "Pending"}
            </span>
          </div>
          <p className="order-detail__meta">
            Order placed on {formatDateTime(order.createdAt)}
            <span className="order-detail__meta-dot">·</span>
            {order.shippingMethod || "Standard Shipping"}
          </p>
        </div>
        <div className="order-detail__header-actions">
          <button className="order-detail__btn order-detail__btn--outline" onClick={() => window.print()}>
            🖨️ Print Invoice
          </button>
          <button
            className="order-detail__btn order-detail__btn--primary"
            onClick={handleUpdateStatus}
            disabled={updating}
          >
            ✏️ Update Status
          </button>
          <button
            className="order-detail__btn order-detail__btn--danger"
            onClick={handleCancel}
            disabled={updating}
          >
            Cancel Order
          </button>
        </div>
      </div>

      <div className="order-detail__info-grid">
        <div>
          <p className="order-detail__info-label">Customer Details</p>
          <p className="order-detail__info-name">{order.customerName || order.customer?.name || "—"}</p>
          <p className="order-detail__info-line">{order.customerEmail || order.customer?.email || ""}</p>
          <p className="order-detail__info-line">{order.customerPhone || order.customer?.phone || ""}</p>
        </div>
        <div>
          <p className="order-detail__info-label">Shipping Address</p>
          <p className="order-detail__info-line">{order.shippingAddress || "—"}</p>
        </div>
        <div>
          <p className="order-detail__info-label">Payment Method</p>
          <p className="order-detail__info-line">{order.paymentMethod || "—"}</p>
          <p className="order-detail__info-line">{order.transactionId || ""}</p>
          <span className="order-detail__paid-pill">
            {order.paymentStatus === "unpaid" ? "UNPAID" : "PAID"}
          </span>
        </div>
      </div>

      <div className="order-detail__grid">
        <div className="order-detail__main">
          <div className="order-detail__card">
            <h2 className="order-detail__card-title">Order Items ({items.length})</h2>
            <div className="order-detail__table-scroll">
              <table className="order-detail__table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="order-detail__empty">
                        No line items on this order.
                      </td>
                    </tr>
                  )}
                  {items.map((item, index) => {
                    const qty = Number(item.qty || item.quantity || 1);
                    const price = Number(item.price || item.product?.price || 0);
                    return (
                      <tr key={item.id || index}>
                        <td className="order-detail__product-name">
                          {item.name || item.product?.name || "—"}
                        </td>
                        <td>{item.sku || item.product?.slug || "—"}</td>
                        <td>{qty}</td>
                        <td>₹{price.toLocaleString("en-IN")}</td>
                        <td>₹{(price * qty).toLocaleString("en-IN")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="order-detail__side">
          <div className="order-detail__card">
            <h2 className="order-detail__card-title">Pricing Breakdown</h2>
            <div className="order-detail__price-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="order-detail__price-row">
              <span>Shipping Fee</span>
              <span className="order-detail__price-free">{shippingFee ? `₹${shippingFee}` : "FREE"}</span>
            </div>
            <div className="order-detail__price-row">
              <span>Taxes (GST 5%)</span>
              <span>₹{taxes.toLocaleString("en-IN")}</span>
            </div>
            <div className="order-detail__price-row order-detail__price-row--total">
              <span>Total</span>
              <span>₹{Number(total).toLocaleString("en-IN")}</span>
            </div>
            <button className="order-detail__note-btn">Add Note to Invoice</button>
          </div>

          <div className="order-detail__card">
            <h2 className="order-detail__card-title">Tracking Log</h2>
            <div className="order-detail__timeline">
              {STATUS_STEPS.map((step, index) => (
                <div
                  className={`order-detail__timeline-item ${
                    index <= currentStepIndex ? "order-detail__timeline-item--done" : ""
                  }`}
                  key={step}
                >
                  <span className="order-detail__timeline-dot" />
                  <div>
                    <p className="order-detail__timeline-title">{step}</p>
                    {index === currentStepIndex && <p className="order-detail__timeline-desc">Current status</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-detail__notice">
            <span className="order-detail__notice-icon">ⓘ</span>
            <div>
              <strong>Stock Verification</strong>
              <p>Warehouse confirmed stock availability for all items. Ready for packaging.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="order-detail__footer">
        <span>System Generated Record • ID: {order.id}</span>
        <div className="order-detail__footer-links">
          <button className="order-detail__footer-link">Support Ticket</button>
          <button className="order-detail__footer-link">Export Logs</button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
