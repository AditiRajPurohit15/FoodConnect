import api from "./api";

export const registerUser = (data) => api.post("/user/register", data);
export const loginUser = (data) => api.post("/user/login", data);
export const logoutUser = () => api.post("/user/logout");
export const getHome = () => api.get("/user/home");
