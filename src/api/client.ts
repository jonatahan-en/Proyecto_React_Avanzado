import axios from "axios";
import { normalizeError } from "./error";

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

client.interceptors.response.use(undefined, (error) => {
  return Promise.reject(normalizeError(error));
});

export const setAuthorizationHeader = (accessToken: string) => {
  client.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
};

export const removeAuthorizationHeader = () => {
  delete client.defaults.headers["Authorization"];
};
