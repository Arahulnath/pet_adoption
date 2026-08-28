import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Loader } from "../common/Loader";

/**
 * Route guard used for both staff-only and registered-user-only routes.
 * `role` accepts "staff" | "user"; omit it to just require any login.
 */
export default function ProtectedRoute({ children, role }) {
  const { identity, initializing, isAuthenticated } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <Loader label="Checking your session…" />;
  }

  if (!isAuthenticated) {
    const loginPath = role === "staff" ? "/staff/login" : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (role && identity?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
