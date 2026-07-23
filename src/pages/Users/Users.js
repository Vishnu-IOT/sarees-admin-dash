import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./Users.css";

const ROLE_DISTRIBUTION_ORDER = ["Super Admin", "Inventory Lead", "Staff / Warehouse"];

const AUDIT_LOG = [
  { icon: "✏️", text: "Kumar edited 'Inventory Item #S-002'", time: "2 minutes ago" },
  { icon: "🟢", text: "Priya Sharma logged in", time: "14 minutes ago" },
  { icon: "🔒", text: "Role updated for 'Anish Varma'", time: "1 hour ago" },
  { icon: "👤", text: "New user 'Meena Iyer' invited", time: "3 hours ago" },
];

function statusClass(status) {
  return `users__status users__status--${status.toLowerCase()}`;
}

function roleClass(role) {
  return `users__role users__role--${role.toLowerCase().replace(/[^a-z]+/g, "-")}`;
}

function Users() {
  const navigate = useNavigate();
  const { users, removeUser } = useData();

  const activeCount = users.filter((u) => u.status === "Active").length;
  const roleCounts = ROLE_DISTRIBUTION_ORDER.map((role) => ({
    label: role,
    value: users.filter((u) => u.role === role).length,
  }));
  const maxRoleValue = Math.max(users.length, 1);

  const handleDelete = (user) => {
    if (window.confirm(`Remove user "${user.name}"? This can't be undone.`)) {
      removeUser(user.id);
    }
  };

  return (
    <div className="users">
      <div className="users__header">
        <div>
          <h1 className="users__title">User Management</h1>
          <p className="users__subtitle">Configure administrative access and roles for the warehouse system.</p>
        </div>
        <button className="users__btn-primary" onClick={() => navigate("/users/new")}>
          + Add User
        </button>
      </div>

      <div className="users__stats">
        <div className="users__stat-card">
          <span className="users__stat-label">Total Users</span>
          <span className="users__stat-value">{users.length}</span>
        </div>
        <div className="users__stat-card">
          <span className="users__stat-label">Active Now</span>
          <span className="users__stat-value users__stat-value--success">{activeCount}</span>
        </div>
        <div className="users__stat-card">
          <span className="users__stat-label">Roles Defined</span>
          <span className="users__stat-value">5</span>
        </div>
        <div className="users__stat-card">
          <span className="users__stat-label">Pending Invites</span>
          <span className="users__stat-value users__stat-value--warning">3</span>
        </div>
      </div>

      <div className="users__grid">
        <div className="users__panel">
          <div className="users__panel-header">
            <h2 className="users__panel-title">Administrator Directory</h2>
            <div className="users__panel-actions">
              <button className="users__icon-btn">⏷</button>
              <button className="users__icon-btn">⬇️</button>
            </div>
          </div>

          <div className="users__table-scroll">
            <table className="users__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="users__name-cell">
                        <span className="users__avatar">{user.name.charAt(0)}</span>
                        <div>
                          <p className="users__name">{user.name}</p>
                          <p className="users__uid">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={roleClass(user.role)}>{user.role}</span>
                    </td>
                    <td className="users__email">{user.email}</td>
                    <td>
                      <span className={statusClass(user.status)}>
                        <span className="users__status-dot" /> {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="users__row-actions">
                        <button
                          className="users__edit-btn"
                          onClick={() => navigate(`/users/edit/${user.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="users__delete-btn"
                          onClick={() => handleDelete(user)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="users__pagination">
            <span>Showing 1 to {users.length} of {users.length} entries</span>
            <div className="users__pagination-controls">
              <button className="users__page-btn">‹</button>
              <button className="users__page-btn users__page-btn--active">1</button>
              <button className="users__page-btn">›</button>
            </div>
          </div>
        </div>

        <div className="users__side">
          <div className="users__card">
            <h3 className="users__card-title">Role Distributions</h3>
            {roleCounts.map((role) => (
              <div className="users__role-row" key={role.label}>
                <div className="users__role-row-top">
                  <span>{role.label}</span>
                  <span>{role.value}</span>
                </div>
                <div className="users__role-bar">
                  <div
                    className="users__role-bar-fill"
                    style={{ width: `${(role.value / maxRoleValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <button className="users__manage-roles">Manage Roles</button>
          </div>

          <div className="users__card">
            <h3 className="users__card-title">Audit Log</h3>
            <div className="users__audit-list">
              {AUDIT_LOG.map((log, index) => (
                <div className="users__audit-item" key={index}>
                  <span className="users__audit-icon">{log.icon}</span>
                  <div>
                    <p className="users__audit-text">{log.text}</p>
                    <p className="users__audit-time">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
