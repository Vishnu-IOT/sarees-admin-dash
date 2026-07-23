import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./Layout.css";

function Layout({ searchPlaceholder, userName, userRole }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="layout__main">
        <Topbar
          searchPlaceholder={searchPlaceholder}
          userName={userName}
          userRole={userRole}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="layout__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
