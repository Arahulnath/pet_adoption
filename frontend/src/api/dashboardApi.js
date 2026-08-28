import axiosClient from "./axiosClient";

// Covers FR14 (Basic Analytics and Reporting) — staff dashboard.
const dashboardApi = {
  getStats: (months = 1) => axiosClient.get(`/analytics/dashboard?months=${months}`),
};

export default dashboardApi;
