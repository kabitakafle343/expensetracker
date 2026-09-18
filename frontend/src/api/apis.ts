import axios from "axios";
import TokenService from "./tokenservice"; 

const HttpClient = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 2 * 60 * 1000,
});

HttpClient.interceptors.request.use(async (config) => {
  const token = TokenService.getToken();
  if (token?.access) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token.access}`;
  }
  return config;
});

HttpClient.interceptors.response.use(
  async (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      TokenService.clearToken();
      window.location.href = "/"; 
    }
    return Promise.reject(error);
  }
);

export default HttpClient;