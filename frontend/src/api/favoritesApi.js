import axiosClient from "./axiosClient";

// Covers FR5 (Pet Wishlist/Favorites) — registered users only.
const favoritesApi = {
  getFavorites: () => axiosClient.get("/favorites"),
  addFavorite: (petId) => axiosClient.post(`/favorites/${petId}`),
  removeFavorite: (petId) => axiosClient.delete(`/favorites/${petId}`),
};

export default favoritesApi;
