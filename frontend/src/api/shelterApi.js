import axiosClient from "./axiosClient";

// Covers FR12 (Shelter Information Management).
const shelterApi = {
  getShelterInfo: () => axiosClient.get("/shelter"),
  updateShelterInfo: (payload) => axiosClient.put("/shelter", payload),
};

export default shelterApi;
