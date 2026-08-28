import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Custom hook wrapping useContext(AuthContext) — the pattern the SRS/viva
// notes ask for: "useAuth()" as a named example of a custom hook.
export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
