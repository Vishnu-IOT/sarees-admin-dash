import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import UpdateStatusModal from "./UpdateStatusModal";
import * as ordersApi from "../../api/ordersApi";
import "./OrderDetail.css";

const STATUS_STEPS = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered"];

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
  const { changeOrderStatus } = useData();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await ordersApi.getOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error("Failed to load order", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    if (!order || !window.confirm(`Cancel order #${order.orderNumber || `ORD-${id}`}?`)) return;
    setUpdating(true);
    try {
      await changeOrderStatus(id, "Cancelled");
      await loadOrder();
    } catch (err) {
      window.alert(err.response?.data?.message || "Couldn't cancel this order.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
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

  // ✅ Real field names from the backend Order/OrderItem models —
  // previously this looked for order.total / order.totalAmount / item.qty,
  // none of which exist, so pricing always fell back to 0.
  const items = order.items || [];
  const subtotal = Number(order.subtotal || 0);
  const shippingFee = Number(order.shippingCharge || 0);
  const discount = Number(order.discount || 0);
  const total = Number(order.grandTotal || subtotal - discount + shippingFee);

  const currentStepIndex = Math.max(
    STATUS_STEPS.findIndex((step) => step === order.status),
    0
  );
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="order-detail">
      <button className="order-detail__back" onClick={() => navigate("/orders")}>
        ← Order Management
      </button>

      <div className="order-detail__header">
        <div>
          <div className="order-detail__heading-row">
            <h1 className="order-detail__id">#{order.orderNumber || `ORD-${order.id}`}</h1>
            <span className={`order-detail__badge order-detail__badge--${(order.status || "pending").toLowerCase()}`}>
              {order.status || "Pending"}
            </span>
          </div>
          <p className="order-detail__meta">
            Order placed on {formatDateTime(order.createdAt)}
            <span className="order-detail__meta-dot">·</span>
            {order.paymentMethod || "WhatsApp"}
          </p>
        </div>
        <div className="order-detail__header-actions">
          <button className="order-detail__btn order-detail__btn--outline" onClick={() => window.print()}>
            🖨️ Print Invoice
          </button>
          <button
            className="order-detail__btn order-detail__btn--primary"
            onClick={() => setShowStatusModal(true)}
            disabled={updating}
          >
            ✏️ Update Status
          </button>
          <button
            className="order-detail__btn order-detail__btn--danger"
            onClick={handleCancel}
            disabled={updating || isCancelled}
          >
            Cancel Order
          </button>
        </div>
      </div>

      <div className="order-detail__info-grid">
        <div>
          <p className="order-detail__info-label">Customer Details</p>
          <p className="order-detail__info-name">{order.customer?.name || order.shippingName || "—"}</p>
          <p className="order-detail__info-line">{order.customer?.email || order.shippingEmail || ""}</p>
          <p className="order-detail__info-line">{order.customer?.phone || order.shippingPhone || ""}</p>
        </div>
        <div>
          <p className="order-detail__info-label">Shipping Address</p>
          <p className="order-detail__info-line">{order.shippingAddress || "—"}</p>
          <p className="order-detail__info-line">
            {[order.shippingCity, order.shippingState, order.shippingPincode].filter(Boolean).join(", ")}
          </p>
        </div>
        <div>
          <p className="order-detail__info-label">Payment Method</p>
          <p className="order-detail__info-line">{order.paymentMethod || "—"}</p>
          <span
            className="order-detail__paid-pill"
            style={order.paymentStatus !== "Paid" ? { background: "var(--color-warning-bg)", color: "var(--color-warning-text)" } : undefined}
          >
            {(order.paymentStatus || "Pending").toUpperCase()}
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
                  {items.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="order-detail__product-name">
                        {item.productName || item.product?.name || "—"}
                        {(item.color || item.size) && (
                          <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                            {[item.color, item.size].filter(Boolean).join(" · ")}
                          </div>
                        )}
                      </td>
                      <td>{item.sku || "—"}</td>
                      <td>{item.quantity}</td>
                      <td>₹{Number(item.price || 0).toLocaleString("en-IN")}</td>
                      <td>₹{Number(item.subtotal || 0).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
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
              <span>Discount</span>
              <span>{discount ? `− ₹${discount.toLocaleString("en-IN")}` : "—"}</span>
            </div>
            <div className="order-detail__price-row">
              <span>Shipping Fee</span>
              <span className="order-detail__price-free">{shippingFee ? `₹${shippingFee}` : "FREE"}</span>
            </div>
            <div className="order-detail__price-row order-detail__price-row--total">
              <span>Grand Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="order-detail__card">
            <h2 className="order-detail__card-title">Tracking Log</h2>
            {isCancelled ? (
              <p style={{ fontSize: "13px", color: "var(--color-danger-text)", fontWeight: 700 }}>
                This order was cancelled.
              </p>
            ) : (
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
            )}
          </div>
        </div>
      </div>

      <div className="order-detail__footer">
        <span>System Generated Record • ID: {order.id}</span>
      </div>

      {showStatusModal && (
        <UpdateStatusModal
          order={order}
          onClose={() => setShowStatusModal(false)}
          onUpdated={() => loadOrder()}
        />
      )}
    </div>
  );
}

export default OrderDetail;
