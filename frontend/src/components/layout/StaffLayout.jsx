import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import "./StaffLayout.css";

export default function StaffLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="staff-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="staff-shell__main">
        <header className="staff-shell__header">
          <button
            className="staff-shell__menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="staff-shell__header-title">Staff Console</span>
        </header>
        <div className="staff-shell__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
