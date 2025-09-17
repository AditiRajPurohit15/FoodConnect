import api from "./api";

export const addFood = (data) => api.post("/api/foods/add", data);
export const getAvailableFoods = () => api.get("/api/foods/available");
export const getFoodById = (id) => api.get(`/api/foods/${id}`);
export const updateFoodStatus = (id, status) =>
  api.put(`/api/foods/${id}`, { status });
export const deleteFood = (id) => api.delete(`/api/foods/${id}`);
