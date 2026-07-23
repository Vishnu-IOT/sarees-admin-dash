import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./Orders.css";

function statusClass(status) {
  return `orders__status orders__status--${(status || "").toLowerCase()}`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

function Orders() {
  const navigate = useNavigate();
  const { orders, ordersLoading } = useData();

  const pendingCount = orders.filter((o) => (o.status || "").toLowerCase() === "pending").length;
  const outForDeliveryCount = orders.filter(
    (o) => (o.status || "").toLowerCase() === "shipped" || (o.status || "").toLowerCase() === "out_for_delivery"
  ).length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || o.totalAmount || 0), 0);

  return (
    <div className="orders">
      <div className="orders__header">
        <div>
          <h1 className="orders__title">Order Management</h1>
          <p className="orders__subtitle">Process and monitor customer inventory transactions.</p>
        </div>
      </div>

      <div className="orders__stats">
        <div className="orders__stat-card">
          <span className="orders__stat-label">Total Orders</span>
          <span className="orders__stat-value">{orders.length}</span>
        </div>
        <div className="orders__stat-card">
          <span className="orders__stat-label">Pending Shipments</span>
          <span className="orders__stat-value orders__stat-value--warning">{pendingCount}</span>
        </div>
        <div className="orders__stat-card">
          <span className="orders__stat-label">Out for Delivery</span>
          <span className="orders__stat-value orders__stat-value--info">{outForDeliveryCount}</span>
        </div>
        <div className="orders__stat-card">
          <span className="orders__stat-label">Total Revenue (INR)</span>
          <span className="orders__stat-value">
            ₹{(totalRevenue / 100000).toFixed(1)}L
          </span>
        </div>
      </div>

      <div className="orders__panel">
        <div className="orders__panel-header">
          <button className="orders__filters-btn">▽ Filters</button>
          <span className="orders__panel-count">
            {ordersLoading ? "Loading orders..." : `Showing ${orders.length} orders`}
          </span>
        </div>

        <div className="orders__table-scroll">
          <table className="orders__table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product Details</th>
                <th>Date</th>
                <th>Total (INR)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!ordersLoading && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="orders__empty">
                    No orders yet.
                  </td>
                </tr>
              )}
              {orders.map((order) => {
                const firstItem = order.items?.[0] || order.orderItems?.[0];
                return (
                  <tr key={order.id}>
                    <td className="orders__id">#ORD-{order.id}</td>
                    <td>
                      <p className="orders__customer-name">
                        {order.customerName || order.customer?.name || "—"}
                      </p>
                      <p className="orders__customer-email">
                        {order.customerEmail || order.customer?.email || ""}
                      </p>
                    </td>
                    <td>
                      <p className="orders__product-name">
                        {firstItem?.name || firstItem?.product?.name || "—"}
                      </p>
                      <p className="orders__product-sku">
                        SKU: {firstItem?.sku || firstItem?.product?.slug || "—"}
                      </p>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      ₹{Number(order.total || order.totalAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span className={statusClass(order.status)}>{order.status || "Pending"}</span>
                    </td>
                    <td>
                      <div className="orders__actions">
                        <button
                          className="orders__icon-btn"
                          aria-label="View order"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          👁️
                        </button>
                        <button className="orders__icon-btn" aria-label="Print invoice">
                          🖨️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;
