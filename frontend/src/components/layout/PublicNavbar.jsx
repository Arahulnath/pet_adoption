import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PawPrint, Menu, X, Heart, UserCircle, LogOut, ShieldCheck, Home } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import "./PublicNavbar.css";

const LINKS = [
  { to: "/", label: "Home", end: true, icon: Home },
  { to: "/pets", label: "Find a Pet" },
  { to: "/shelter", label: "Shelter" },
  { to: "/donate", label: "Donate" },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const { isUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="pnav">
      <div className="container pnav__inner">
        <NavLink to="/" className="pnav__brand" onClick={() => setOpen(false)}>
          <PawPrint size={22} />
          <span>Pawfinder</span>
        </NavLink>

        <nav className={`pnav__links ${open ? "pnav__links--open" : ""}`}>
          {LINKS.map(({ to, label, end, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `pnav__link ${isActive ? "pnav__link--active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {Icon && <Icon size={15} />}
              {label}
            </NavLink>
          ))}

          <div className="pnav__divider" />

          {isUser ? (
            <>
              <NavLink
                to="/favorites"
                className={({ isActive }) => `pnav__link ${isActive ? "pnav__link--active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <Heart size={15} /> Favorites
              </NavLink>
              <NavLink
                to="/my-requests"
                className={({ isActive }) => `pnav__link ${isActive ? "pnav__link--active" : ""}`}
                onClick={() => setOpen(false)}
              >
                My Requests
              </NavLink>
              <button className="pnav__link pnav__link--button" onClick={handleLogout}>
                <LogOut size={15} /> Log out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="pnav__link" onClick={() => setOpen(false)}>
              <UserCircle size={15} /> Log in
            </NavLink>
          )}

          <NavLink to="/staff/login" className="pnav__staff-link" onClick={() => setOpen(false)}>
            <ShieldCheck size={14} /> Staff
          </NavLink>
        </nav>

        <button
          className="pnav__toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
