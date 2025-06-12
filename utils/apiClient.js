import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000", // or your API server
});


axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
