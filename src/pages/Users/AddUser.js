import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./AddUser.css";

const ROLE_OPTIONS = ["Super Admin", "Inventory Lead", "QC Auditor", "Cataloger", "Staff / Warehouse"];
const STATUS_OPTIONS = ["Active", "Away", "Offline"];

function AddUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { users, addUser, editUser } = useData();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: ROLE_OPTIONS[0],
    status: "Active",
  });

  useEffect(() => {
    if (isEditMode) {
      const existing = users.find((u) => u.id === id);
      if (existing) {
        setForm({
          name: existing.name || "",
          email: existing.email || "",
          role: existing.role || ROLE_OPTIONS[0],
          status: existing.status || "Active",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditMode) {
      editUser(id, form);
    } else {
      addUser(form);
    }
    navigate("/users");
  };

  return (
    <div className="add-user">
      <div className="add-user__breadcrumb">
        <button className="add-user__breadcrumb-link" onClick={() => navigate("/users")}>
          Users
        </button>
        <span> &gt; </span>
        <span className="add-user__breadcrumb-current">{isEditMode ? "Edit User" : "Add User"}</span>
      </div>

      <div className="add-user__header">
        <h1 className="add-user__title">{isEditMode ? "Edit User" : "Add New User"}</h1>
        <div className="add-user__header-actions">
          <button className="add-user__btn add-user__btn--outline" onClick={() => navigate("/users")}>
            Cancel
          </button>
          <button type="submit" form="add-user-form" className="add-user__btn add-user__btn--primary">
            {isEditMode ? "Update User" : "Save User"}
          </button>
        </div>
      </div>

      <form id="add-user-form" className="add-user__card" onSubmit={handleSave}>
        <label className="add-user__label">Full Name</label>
        <input
          className="add-user__input"
          name="name"
          placeholder="e.g. Rajesh Kumar"
          value={form.name}
          onChange={handleChange}
        />

        <label className="add-user__label">Business Email</label>
        <input
          className="add-user__input"
          name="email"
          type="email"
          placeholder="name@sareejewelry.co"
          value={form.email}
          onChange={handleChange}
        />

        <div className="add-user__row">
          <div className="add-user__field">
            <label className="add-user__label">Role</label>
            <select className="add-user__input" name="role" value={form.role} onChange={handleChange}>
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="add-user__field">
            <label className="add-user__label">Status</label>
            <select className="add-user__input" name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddUser;
