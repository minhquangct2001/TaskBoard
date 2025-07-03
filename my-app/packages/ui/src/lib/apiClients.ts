
import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { Base_Url } from "@workspace/ui/share/Base_Url";

const apiClient = axios.create({
  baseURL: Base_Url,
  timeout: 10000, // Timeout 10 giây
  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("Interceptor Response Data:", response.data); 
    return response.data;
  },
  (error) => {
    console.error("API Error:", error.message);
    return Promise.reject(error);
  }
);

export async function apiRequest<T, D = unknown>(
  method: Method,
  endpoint: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.request<T>({
      method,
      url: endpoint,
      data,
      ...config,
    });
    return response as T;
  } catch (error) {
    throw error;
  }
}

// Convenience methods
export const get = <T>(endpoint: string, config?: AxiosRequestConfig) =>
  apiRequest<T>("GET", endpoint, undefined, config);

export const post = <T, D = unknown>(
  endpoint: string,
  data: D,
  config?: AxiosRequestConfig
) => apiRequest<T, D>("POST", endpoint, data, config);

export const put = <T, D = unknown>(
  endpoint: string,
  data: D,
  config?: AxiosRequestConfig
) => apiRequest<T, D>("PUT", endpoint, data, config);

export const patch = <T, D = unknown>(
  endpoint: string,
  data: D,
  config?: AxiosRequestConfig
) => apiRequest<T, D>("PATCH", endpoint, data, config);

export const del = <T>(endpoint: string, config?: AxiosRequestConfig) =>
  apiRequest<T>("DELETE", endpoint, undefined, config);
