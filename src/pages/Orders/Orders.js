import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import UpdateStatusModal from "./UpdateStatusModal";
import "./Orders.css";

const STATUS_FILTERS = ["", "Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

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
  const { orders, ordersLoading, ordersMeta, fetchOrders } = useData();
  const [statusFilter, setStatusFilter] = useState("");
  const [statusOrder, setStatusOrder] = useState(null);

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const shippedCount = orders.filter((o) => o.status === "Shipped").length;
  // ✅ Real field is grandTotal — `total`/`totalAmount` don't exist on the
  // Order model, so this used to always add up to ₹0.
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.grandTotal || 0), 0);

  const applyStatusFilter = (status) => {
    setStatusFilter(status);
    fetchOrders({ status, page: 1 });
  };

  const goToPage = (page) => {
    fetchOrders({ status: statusFilter, page });
  };

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
          <span className="orders__stat-value">{ordersMeta.totalOrders}</span>
        </div>
        <div className="orders__stat-card">
          <span className="orders__stat-label">Pending</span>
          <span className="orders__stat-value orders__stat-value--warning">{pendingCount}</span>
        </div>
        <div className="orders__stat-card">
          <span className="orders__stat-label">Shipped</span>
          <span className="orders__stat-value orders__stat-value--info">{shippedCount}</span>
        </div>
        <div className="orders__stat-card">
          <span className="orders__stat-label">Revenue (this page, INR)</span>
          <span className="orders__stat-value">
            ₹{(totalRevenue / 1000).toFixed(1)}K
          </span>
        </div>
      </div>

      <div className="orders__panel">
        <div className="orders__panel-header">
          <select
            className="orders__filters-btn"
            value={statusFilter}
            onChange={(e) => applyStatusFilter(e.target.value)}
          >
            {STATUS_FILTERS.map((status) => (
              <option key={status || "all"} value={status}>
                {status || "All statuses"}
              </option>
            ))}
          </select>
          <span className="orders__panel-count">
            {ordersLoading ? "Loading orders..." : `Showing ${orders.length} of ${ordersMeta.totalOrders} orders`}
          </span>
        </div>

        <div className="orders__table-scroll">
          <table className="orders__table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
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
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="orders__id">#{order.orderNumber || `ORD-${order.id}`}</td>
                  <td>
                    <p className="orders__customer-name">
                      {order.customer?.name || order.shippingName || "—"}
                    </p>
                    <p className="orders__customer-email">
                      {order.customer?.phone || order.shippingPhone || ""}
                    </p>
                  </td>
                  <td>{order.totalItems || 0} item{Number(order.totalItems) === 1 ? "" : "s"}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>₹{Number(order.grandTotal || 0).toLocaleString("en-IN")}</td>
                  <td>
                    <span className={statusClass(order.status)}>{order.status || "Pending"}</span>
                  </td>
                  <td>
                    <div className="orders__actions">
                      <button
                        className="orders__icon-btn"
                        aria-label="View order"
                        title="View order"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        👁️
                      </button>
                      <button
                        className="orders__icon-btn"
                        aria-label="Update status"
                        title="Update status"
                        onClick={() => setStatusOrder(order)}
                      >
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {ordersMeta.totalPages > 1 && (
          <div className="orders__pagination">
            <span>
              Page {ordersMeta.currentPage} of {ordersMeta.totalPages}
            </span>
            <div className="orders__pagination-controls">
              <button
                className="orders__page-btn"
                disabled={ordersMeta.currentPage === 1}
                onClick={() => goToPage(ordersMeta.currentPage - 1)}
              >
                🠔
              </button>
              <button
                className="orders__page-btn"
                disabled={ordersMeta.currentPage === ordersMeta.totalPages}
                onClick={() => goToPage(ordersMeta.currentPage + 1)}
              >
                ➝
              </button>
            </div>
          </div>
        )}
      </div>

      {statusOrder && (
        <UpdateStatusModal
          order={statusOrder}
          onClose={() => setStatusOrder(null)}
          onUpdated={() => fetchOrders({ status: statusFilter, page: ordersMeta.currentPage })}
        />
      )}
    </div>
  );
}

export default Orders;
