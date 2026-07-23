import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./Users.css";

const ROLE_DISTRIBUTION_ORDER = ["Super Admin", "Inventory Lead", "QC Auditor", "Cataloger", "Staff / Warehouse"];

function statusClass(status) {
  return `users__status users__status--${(status || "Active").toLowerCase()}`;
}

function roleClass(role) {
  return `users__role users__role--${(role || "Admin").toLowerCase().replace(/[^a-z]+/g, "-")}`;
}

function Users() {
  const navigate = useNavigate();
  const { users, usersLoading, removeUser } = useData();

  const activeCount = users.filter((u) => u.status === "Active").length;
  const roleCounts = ROLE_DISTRIBUTION_ORDER.map((role) => ({
    label: role,
    value: users.filter((u) => u.role === role).length,
  }));
  const maxRoleValue = Math.max(users.length, 1);

  const handleDelete = async (user) => {
    if (window.confirm(`Remove admin user "${user.name}"? This can't be undone.`)) {
      try {
        await removeUser(user.id);
      } catch (err) {
        window.alert(err.response?.data?.message || "Couldn't delete user.");
      }
    }
  };

  return (
    <div className="users">
      <div className="users__header">
        <div>
          <h1 className="users__title">Admin User Management</h1>
          <p className="users__subtitle">Configure administrative access and staff roles for the admin panel.</p>
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
      </div>

      <div className="users__grid">
        <div className="users__panel">
          <div className="users__panel-header">
            <h2 className="users__panel-title">Administrator Directory</h2>
          </div>

          {usersLoading && <p style={{ padding: "20px" }}>Loading admin users...</p>}

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
                {!usersLoading && users.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "#888" }}>
                      No admin users found. Click "+ Add User" to create one.
                    </td>
                  </tr>
                )}
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="users__name-cell">
                        <span className="users__avatar">{(user.name || "U").charAt(0).toUpperCase()}</span>
                        <div>
                          <p className="users__name">{user.name}</p>
                          <p className="users__uid">ID: #{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={roleClass(user.role)}>{user.role || "Admin"}</span>
                    </td>
                    <td className="users__email">{user.email}</td>
                    <td>
                      <span className={statusClass(user.status)}>
                        <span className="users__status-dot" /> {user.status || "Active"}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
