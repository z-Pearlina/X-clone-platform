import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://x-clone-platform.vercel.app/api";
// ! 🔥 localhost api would not work on your actual physical device
// const API_BASE_URL = "http://localhost:5001/api";

// this will basically create an authenticated api, pass the token into our headers
export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    console.log("Sending token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
  updateProfile: (api: AxiosInstance, data: any) => api.put("/users/profile", data),
};