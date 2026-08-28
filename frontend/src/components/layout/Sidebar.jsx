import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PawPrint,
  ClipboardList,
  Building2,
  LogOut,
  X,
  Home,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { initials } from "../../utils/formatters";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/staff/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/staff/pets", label: "Pets", icon: PawPrint },
  { to: "/staff/requests", label: "Adoption Requests", icon: ClipboardList },
  { to: "/staff/shelter", label: "Shelter Info", icon: Building2 },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { identity, logout } = useAuth();

  return (
    <>
      {mobileOpen && <div className="sidebar__scrim" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__top">
          <NavLink to="/staff/dashboard" className="sidebar__brand">
            <PawPrint size={20} />
            <span>Pawfinder</span>
          </NavLink>
          <button className="sidebar__close" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
              onClick={onClose}
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
          <NavLink to="/" className="sidebar__link" onClick={onClose}>
            <Home size={17} />
            <span>Public Home</span>
          </NavLink>
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__profile">
            <div className="sidebar__avatar">{initials(identity?.username || identity?.name || "St")}</div>
            <div className="sidebar__profile-text">
              <p className="sidebar__profile-name">{identity?.username || identity?.name || "Staff"}</p>
              <p className="sidebar__profile-role">{identity?.role === "staff" ? (identity?.staffRole || "Staff") : "Staff"}</p>
            </div>
          </div>
          <button className="sidebar__logout" onClick={logout}>
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}
