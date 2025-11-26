import axios from "axios";

const url = "https://cricketauction-production-8eae.up.railway.app";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: url,
});

export default axiosInstance;
