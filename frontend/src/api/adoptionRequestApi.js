import axiosClient from "./axiosClient";

// Covers FR6 (submit request), FR9 (staff manage lifecycle), FR10
// (status transitions) and the "View Own Requests" row of the RBAC matrix.
const adoptionRequestApi = {
  // Submit a request — petId is required, rest of payload is applicant info.
  createRequest: ({ petId, ...payload }) =>
    axiosClient.post(`/adoption-requests/pet/${petId}`, payload),

  // Registered user: requests they personally submitted.
  getMyRequests: () => axiosClient.get("/adoption-requests/mine"),

  // Staff: full list, filterable by status.
  getRequests: (params = {}) => axiosClient.get("/adoption-requests", { params }),

  getRequestById: (id) => axiosClient.get(`/adoption-requests/${id}`),

  // Staff: update status — backend uses PUT /{id}/status with { status }
  updateRequestStatus: (id, status) =>
    axiosClient.put(`/adoption-requests/${id}/status`, { status }),
};

export default adoptionRequestApi;
