import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./Dashboard.css";

function statusClass(status) {
  return `dashboard__status dashboard__status--${(status || "").toLowerCase().replace(/\s+/g, "-")}`;
}

function Dashboard() {
  const navigate = useNavigate();
  const { products, orders, looms, users, categories } = useData();

  const activeLooms = looms.filter((l) => l.status).length;
  const recentProducts = products.slice(0, 5);
  const trendingProduct = products[0];
  const categoryTotals = categories.map((cat) => ({
    label: cat.category,
    value: products.filter((p) => String(p.categoryId) === String(cat.id)).length,
  }));

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Operations Overview</h1>
          <p className="dashboard__subtitle">Real-time status of products and warehouse activity.</p>
        </div>
        <div className="dashboard__header-actions">
          {/* <button className="dashboard__btn dashboard__btn--outline">Export Data</button> */}
          <button className="dashboard__btn dashboard__btn--primary" onClick={() => navigate("/inventory/new")}>
            + Add New Products
          </button>
        </div>
      </div>

      <div className="dashboard__stats">
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-top">
            <span className="dashboard__stat-label">Total Products</span>
            <span className="dashboard__stat-icon">📋</span>
          </div>
          <div className="dashboard__stat-value">{products.length}</div>
          <div className="dashboard__stat-note">Across {categories.length} categories</div>
        </div>

        <div className="dashboard__stat-card">
          <div className="dashboard__stat-top">
            <span className="dashboard__stat-label">Active Looms</span>
            <span className="dashboard__stat-icon">🧶</span>
          </div>
          <div className="dashboard__stat-value">
            {activeLooms} / {looms.length}
          </div>
          <div className="dashboard__stat-progress">
            <div
              className="dashboard__stat-progress-bar"
              style={{ width: `${looms.length ? (activeLooms / looms.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="dashboard__stat-card">
          <div className="dashboard__stat-top">
            <span className="dashboard__stat-label">Orders</span>
            <span className="dashboard__stat-icon">🛒</span>
          </div>
          <div className="dashboard__stat-value">{orders.length}</div>
          <div className="dashboard__stat-note">
            {orders.filter((o) => (o.status || "").toLowerCase() === "pending").length} pending
          </div>
        </div>

        <div className="dashboard__stat-card">
          <div className="dashboard__stat-top">
            <span className="dashboard__stat-label">System Users</span>
            <span className="dashboard__stat-icon">👥</span>
          </div>
          <div className="dashboard__stat-value">{users.filter((user) => user.role === "Admin").length}</div>
          <div className="dashboard__stat-note">Admin access only</div>
        </div>
      </div>

      <div className="dashboard__grid">
        <div className="dashboard__panel">
          <div className="dashboard__panel-header">
            <h2 className="dashboard__panel-title">Recent Products</h2>
            <button className="dashboard__view-all" onClick={() => navigate("/inventory")}>
              View All
            </button>
          </div>
          <table className="dashboard__table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="dashboard__empty">
                    No products yet.
                  </td>
                </tr>
              )}
              {recentProducts.map((product) => (
                <tr key={product.id}>
                  <td className="dashboard__sku">{product.name}</td>
                  <td>{product.category?.name || "—"}</td>
                  <td>₹{Number(product.price || 0).toLocaleString("en-IN")}</td>
                  <td>
                    <span className={statusClass(product.status)}>{product.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard__side">
          <div className="dashboard__product-card">
            <span className="dashboard__product-badge">Trending</span>
            <div className="dashboard__product-image">🥻</div>
            <h3 className="dashboard__product-name">{trendingProduct?.name || "No products yet"}</h3>
            <div className="dashboard__product-meta">
              <span className="dashboard__product-price">
                ₹{Number(trendingProduct?.price || 0).toLocaleString("en-IN")}
              </span>
              <span className="dashboard__product-sku">{trendingProduct?.category?.category || ""}</span>
            </div>
          </div>

          <div className="dashboard__loom-card">
            <div className="dashboard__loom-header">
              <span>Loom Status</span>
              <span className="dashboard__loom-dot" />
            </div>
            <p className="dashboard__loom-name">
              {activeLooms} of {looms.length} looms active
            </p>
            <div className="dashboard__loom-progress-row">
              <span className="dashboard__loom-progress-label">Utilization</span>
              <span className="dashboard__loom-progress-value">
                {looms.length ? Math.round((activeLooms / looms.length) * 100) : 0}%
              </span>
            </div>
            <div className="dashboard__loom-chart">
              <svg viewBox="0 0 200 50" preserveAspectRatio="none">
                <polyline
                  points="0,40 25,20 50,30 75,10 100,25 125,15 150,30 175,8 200,20"
                  fill="none"
                  stroke="#e7a9bb"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard__distribution">
        <h2 className="dashboard__distribution-title">Products by Category</h2>
        <div className="dashboard__distribution-grid">
          {categoryTotals.length === 0 && (
            <p className="dashboard__empty">No categories yet.</p>
          )}
          {categoryTotals.map((item) => (
            <div className="dashboard__distribution-card" key={item.label}>
              <span className="dashboard__distribution-label">{item.label}</span>
              <span className="dashboard__distribution-value">{item.value}</span>
            </div>
          ))}
          <button className="dashboard__distribution-add" onClick={() => navigate("/categories/new")}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
