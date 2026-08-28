import axios from "axios";

// Single Axios instance used by every *Api.js module. Centralizing this
// means the base URL, auth header, and error normalization only need to
// be written once — components never call axios directly (Rubric 3.1).
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Attach the JWT (SRS FR7 — staff auth, FR4 — user auth) to every request
// if one is present. Both staff and registered-user tokens are stored
// under the same key since a browser session is only ever one identity.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("pawfinder_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors into a predictable shape: { status, message, fieldErrors }
// so every page can render backend validation errors (400/409/422) the
// same way instead of dumping "AxiosError 409" on screen.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    let message = "Something went wrong. Please try again.";
    if (!error.response) {
      message = "Network error — check your connection and try again.";
    } else if (status === 401) {
      message = data?.message || "Your session has expired. Please log in again.";
    } else if (status === 403) {
      message = data?.message || "You don't have permission to do that.";
    } else if (status === 404) {
      message = data?.message || "We couldn't find what you were looking for.";
    } else if (status === 409) {
      message = data?.message || "This conflicts with existing data.";
    } else if (status === 422 || status === 400) {
      message = data?.message || "Please check the highlighted fields.";
    } else if (status >= 500) {
      message = "The server ran into a problem. Please try again shortly.";
    }

    if (status === 401 && !window.location.pathname.includes("login")) {
      localStorage.removeItem("pawfinder_token");
      localStorage.removeItem("pawfinder_identity");
    }

    const normalized = new Error(message);
    normalized.status = status ?? 0;
    normalized.fieldErrors = data?.errors || data?.fieldErrors || null;
    normalized.raw = error;

    return Promise.reject(normalized);
  }
);

export default axiosClient;
