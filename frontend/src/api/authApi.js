import axiosClient from "./axiosClient";

// Maps to FR4 (User Registration) and FR7 (Staff Authentication).
// Adjust these paths to match your real backend if they differ —
// this is the only file that needs to change.
const authApi = {
  registerUser: (payload) => axiosClient.post("/auth/user/register", payload),
  loginUser: (payload) => axiosClient.post("/auth/user/login", payload),
  loginStaff: (payload) => axiosClient.post("/auth/staff/login", payload),
  getCurrentProfile: () => axiosClient.get("/auth/me"),
  logout: () => Promise.resolve(),
};

export default authApi;
