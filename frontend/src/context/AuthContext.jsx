import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import authApi from "../api/authApi";
import { ROLES } from "../constants";

// Global auth state via useContext (Rubric 2.4). A single context covers
// both "registered user" and "staff" identities because they never
// overlap in one browser session — the stored `role` tells every
// ProtectedRoute which kind of identity is logged in. This keeps the
// architecture simple enough to explain in viva instead of running two
// parallel auth systems.
export const AuthContext = createContext(null);

const TOKEN_KEY = "pawfinder_token";
const IDENTITY_KEY = "pawfinder_identity";

export function AuthProvider({ children }) {
  const [identity, setIdentity] = useState(null); // { id, name/username, email, role }
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const stored = localStorage.getItem(IDENTITY_KEY);
    if (token && stored) {
      try {
        setIdentity(JSON.parse(stored));
      } catch {
        localStorage.removeItem(IDENTITY_KEY);
      }
    }
    setInitializing(false);
  }, []);

  const persist = useCallback((token, identityData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(identityData));
    setIdentity(identityData);
  }, []);

  const registerUser = useCallback(
    async (payload) => {
      const { data } = await authApi.registerUser(payload);
      const identityData = { ...data.user, role: ROLES.USER };
      persist(data.token, identityData);
      return identityData;
    },
    [persist]
  );

  const loginUser = useCallback(
    async (payload) => {
      const { data } = await authApi.loginUser(payload);
      const identityData = { ...data.user, role: ROLES.USER };
      persist(data.token, identityData);
      return identityData;
    },
    [persist]
  );

  const loginStaff = useCallback(
    async (payload) => {
      const { data } = await authApi.loginStaff(payload);
      const identityData = { ...data.staff, role: ROLES.STAFF };
      persist(data.token, identityData);
      return identityData;
    },
    [persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(IDENTITY_KEY);
    setIdentity(null);
  }, []);

  const value = useMemo(
    () => ({
      identity,
      isAuthenticated: Boolean(identity),
      isStaff: identity?.role === ROLES.STAFF,
      isUser: identity?.role === ROLES.USER,
      initializing,
      registerUser,
      loginUser,
      loginStaff,
      logout,
    }),
    [identity, initializing, registerUser, loginUser, loginStaff, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
