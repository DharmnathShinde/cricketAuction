import axios from "axios";

const url = "http://localhost:8080";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: url,
});

export default axiosInstance;
