import axiosClient from "./axiosClient";

const petApi = {
  getPets: (params = {}) => axiosClient.get("/pets", { params }),
  getPetById: (id) => axiosClient.get(`/pets/${id}`),
  createPet: (payload) => axiosClient.post("/pets", payload),
  updatePet: (id, payload) => axiosClient.put(`/pets/${id}`, payload),
  deletePet: (id) => axiosClient.delete(`/pets/${id}`),
  getPetsByStatus: (status) => axiosClient.get(`/pets/status/${status}`),
  searchPets: (keyword) => axiosClient.get("/pets/search", { params: { keyword } }),
  addImage: (petId, imageUrl) =>
    axiosClient.post(`/pets/${petId}/images`, { imageUrl, isPrimary: true }),
  getImages: (petId) => axiosClient.get(`/pets/${petId}/images`),
};

export default petApi;
