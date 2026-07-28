import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/inventory", label: "Inventory", icon: "📦" },
  { to: "/categories", label: "Categories", icon: "🏷️" },
  { to: "/orders", label: "Orders", icon: "🧾" },
  { to: "/looms", label: "Looms", icon: "🧵" },
  { to: "/users", label: "Users", icon: "👥" },
  { to: "/customers", label: "Customers", icon: "🧑🏻‍💼" },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={isOpen ? "sidebar__overlay sidebar__overlay--visible" : "sidebar__overlay"}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={isOpen ? "sidebar sidebar--open" : "sidebar"}>
        <div className="sidebar__brand">
          <div className="sidebar__logo">SJ</div>
          <div className="sidebar__brand-text">
            <h1 className="sidebar__title">Saree &amp; Jewelry Admin</h1>
            <p className="sidebar__subtitle">Warehouse Management</p>
          </div>
          <button className="sidebar__close" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
              }
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              <span className="sidebar__link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span className="sidebar__link-icon">⚙️</span>
            <span className="sidebar__link-label">Logout</span>
          </NavLink>

          <div className="sidebar__account">
            <div className="sidebar__account-icon">🏬</div>
            <div className="sidebar__account-text">
              <span className="sidebar__account-name">Main Warehouse</span>
              <span className="sidebar__account-role">Varanasi Hub</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
