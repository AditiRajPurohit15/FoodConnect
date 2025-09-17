import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // backend
  withCredentials: true,            // allow cookies
});

export default api;
