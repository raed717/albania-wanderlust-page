/**
 * API Client Configuration
 * 
 * Base axios client for all API requests.
 * Currently configured for future backend integration.
 */

import axios from "axios";

// Base API URL - update this when backend is ready
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token when available
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    console.log(`[API Client] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error("[API Client] Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Client] Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error("[API Client] Response Error:", error.response?.data || error.message);
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      console.warn("[API Client] Unauthorized - redirect to login");
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
