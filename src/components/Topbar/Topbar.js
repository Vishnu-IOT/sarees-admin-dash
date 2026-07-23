import React from "react";
import "./Topbar.css";

function Topbar({
  searchPlaceholder = "Search...",
  userName = "Admin Console",
  userRole = "Administrator",
  onMenuClick,
}) {
  return (
    <header className="topbar">
      <button className="topbar__menu-btn" onClick={onMenuClick} aria-label="Open menu">
        ☰
      </button>

      <div className="topbar__search">
        <span className="topbar__search-icon">🔍</span>
        <input
          type="text"
          className="topbar__search-input"
          placeholder={searchPlaceholder}
        />
      </div>

      <div className="topbar__actions">
        <button className="topbar__icon-btn" type="button" aria-label="Notifications">
          🔔
        </button>
        <div className="topbar__account">
          <span className="topbar__account-icon">👤</span>
          <div className="topbar__account-text">
            <span className="topbar__account-name">{userName}</span>
            <span className="topbar__account-role">{userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
