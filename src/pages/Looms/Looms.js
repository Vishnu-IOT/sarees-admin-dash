import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./Looms.css";

function Looms() {
  const navigate = useNavigate();
  const { looms, loomsLoading, removeLoom } = useData();

  const activeCount = looms.filter((l) => l.status === "active").length;

  const handleDelete = async (loom) => {
    if (window.confirm(`Remove handloom product listing "${loom.name}"? This can't be undone.`)) {
      try {
        await removeLoom(loom.id);
      } catch (err) {
        window.alert("Failed to delete handloom product listing.");
      }
    }
  };

  return (
    <div className="looms">
      <div className="looms__header">
        <div>
          <h1 className="looms__title">Direct-from-Loom Collection</h1>
          <p className="looms__subtitle">Exquisite handloom sarees & artisan weaver products crafted directly at master looms.</p>
        </div>
        <button className="looms__btn-primary" onClick={() => navigate("/inventory/new")}>
          + Add Loom Product
        </button>
      </div>

      <div className="looms__stats">
        <div className="looms__stat-card">
          <span className="looms__stat-label">Total Handloom Items</span>
          <span className="looms__stat-value">{looms.length} Products</span>
        </div>
        <div className="looms__stat-card">
          <span className="looms__stat-label">Active Items</span>
          <span className="looms__stat-value">
            {activeCount}{" "}
            <span className="looms__stat-percent">
              {looms.length ? Math.round((activeCount / looms.length) * 100) : 0}%
            </span>
          </span>
        </div>
        <div className="looms__stat-card">
          <span className="looms__stat-label">Artisan Weaver Line</span>
          <span className="looms__stat-value looms__stat-value--info">Handloom Heritage</span>
        </div>
      </div>

      <div className="looms__panel">
        {loomsLoading && <p className="looms__loading" style={{ padding: "20px" }}>Loading loom products...</p>}

        <div className="looms__table-scroll">
          <table className="looms__table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Sub-Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loomsLoading && looms.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "#888" }}>
                    No handloom product listings found. Tag products with "Direct from Loom" in Inventory.
                  </td>
                </tr>
              )}
              {looms.map((loom) => (
                <tr key={loom.id}>
                  <td className="looms__model">
                    <strong>{loom.name}</strong>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>{loom.desc || "Artisan Handloom"}</div>
                  </td>
                  <td>{loom.category?.name || loom.category?.category || "Saree"}</td>
                  <td>{loom.subcategory?.name || "—"}</td>
                  <td>
                    ₹{Number(loom.price || 0).toLocaleString("en-IN")}
                    {loom.offerPrice && (
                      <span style={{ fontSize: "0.8rem", color: "#e53e3e", marginLeft: "6px" }}>
                        ₹{Number(loom.offerPrice).toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={loom.status === "active" ? "looms__status-text--active" : "looms__status-text--inactive"}>
                      {loom.status || "Active"}
                    </span>
                  </td>
                  <td>
                    <div className="looms__actions">
                      <button
                        className="looms__icon-btn"
                        aria-label="View Details"
                        title="View Details"
                        onClick={() => navigate(`/inventory/view/${loom.id}`)}
                      >
                        👁️
                      </button>
                      <button
                        className="looms__icon-btn"
                        aria-label="Edit"
                        title="Edit Product"
                        onClick={() => navigate(`/inventory/edit/${loom.id}`)}
                      >
                        ✏️
                      </button>
                      <button
                        className="looms__icon-btn"
                        aria-label="Delete"
                        title="Delete Product"
                        onClick={() => handleDelete(loom)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Looms;
