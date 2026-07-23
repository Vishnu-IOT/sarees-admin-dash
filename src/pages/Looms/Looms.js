import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./Looms.css";

function Looms() {
  const navigate = useNavigate();
  const { looms, toggleLoomStatus, removeLoom } = useData();

  const activeCount = looms.filter((l) => l.status).length;
  const maintenanceCount = looms.filter((l) =>
    l.specs?.some((s) => s.toLowerCase().includes("repair"))
  ).length;

  const handleDelete = (loom) => {
    if (window.confirm(`Remove loom "${loom.id}" (${loom.model})? This can't be undone.`)) {
      removeLoom(loom.id);
    }
  };

  return (
    <div className="looms">
      <div className="looms__header">
        <div>
          <h1 className="looms__title">Loom Management</h1>
          <p className="looms__subtitle">Monitor and manage industrial weaving units across facility zones.</p>
        </div>
        <button className="looms__btn-primary" onClick={() => navigate("/looms/new")}>
          + Add Loom
        </button>
      </div>

      <div className="looms__stats">
        <div className="looms__stat-card">
          <span className="looms__stat-label">Total Looms</span>
          <span className="looms__stat-value">{looms.length} Units</span>
        </div>
        <div className="looms__stat-card">
          <span className="looms__stat-label">Active Looms</span>
          <span className="looms__stat-value">
            {activeCount}{" "}
            <span className="looms__stat-percent">
              {looms.length ? Math.round((activeCount / looms.length) * 100) : 0}%
            </span>
          </span>
        </div>
        <div className="looms__stat-card">
          <span className="looms__stat-label">Maintenance Required</span>
          <span className="looms__stat-value looms__stat-value--danger">
            {String(maintenanceCount).padStart(2, "0")} Units
          </span>
        </div>
        <div className="looms__stat-card">
          <span className="looms__stat-label">Active Zone</span>
          <span className="looms__stat-value looms__stat-value--info">Warehouse B</span>
        </div>
      </div>

      <div className="looms__panel">
        <div className="looms__table-scroll">
          <table className="looms__table">
            <thead>
              <tr>
                <th>Loom ID</th>
                <th>Model Name</th>
                <th>Facility Location</th>
                <th>Technical Specs</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {looms.map((loom) => (
                <tr key={loom.id}>
                  <td className="looms__id">{loom.id}</td>
                  <td className="looms__model">{loom.model}</td>
                  <td>{loom.location}</td>
                  <td>
                    <div className="looms__specs">
                      {(loom.specs || []).map((spec) => (
                        <span
                          key={spec}
                          className={
                            spec.toLowerCase().includes("repair")
                              ? "looms__spec looms__spec--warning"
                              : "looms__spec"
                          }
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="looms__status-cell">
                      <button
                        type="button"
                        className={`looms__toggle ${loom.status ? "looms__toggle--on" : ""}`}
                        onClick={() => toggleLoomStatus(loom.id)}
                        aria-label="Toggle loom status"
                      >
                        <span className="looms__toggle-knob" />
                      </button>
                      <span className={loom.status ? "looms__status-text--active" : "looms__status-text--inactive"}>
                        {loom.status ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="looms__actions">
                      <button
                        className="looms__icon-btn"
                        aria-label="Edit"
                        onClick={() => navigate(`/looms/edit/${loom.id}`)}
                      >
                        ✏️
                      </button>
                      <button
                        className="looms__icon-btn"
                        aria-label="Delete"
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

        <div className="looms__pagination">
          <span>Showing 1 to {looms.length} of {looms.length} looms</span>
          <div className="looms__pagination-controls">
            <button className="looms__page-btn">Previous</button>
            <button className="looms__page-btn looms__page-btn--active">1</button>
            <button className="looms__page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Looms;
