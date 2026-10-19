import axios from 'axios';

/**
 * Central Axios HTTP Client
 * 
 * Configured with:
 * 1. Base URL loaded from Vite environment variable: VITE_API_BASE_URL (defaults to http://localhost:8080/api)
 * 2. Automatic JWT Bearer token attachment via request interceptor
 * 3. Centralized response and session expiration (401 Unauthorized) error handling
 */
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10s request timeout
});

// Request Interceptor: Attach JWT Token if available
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lifecare_token') || localStorage.getItem('careplus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize error extraction and handle expired sessions (401)
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle 401 Unauthorized: Session expired or invalid token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('lifecare_token');
      localStorage.removeItem('lifecare_user');
      localStorage.removeItem('careplus_token');
      localStorage.removeItem('careplus_user');

      // Dispatch custom event to notify React Context / UI without hard reload
      window.dispatchEvent(new Event('lifecare_session_expired'));
    }

    const resData = error.response?.data;
    let message =
      resData?.message ||
      error.message ||
      'Network error. Please verify the Spring Boot backend server is running.';

    // If validation field errors exist (from Spring Boot MethodArgumentNotValidException)
    if (resData?.data && typeof resData.data === 'object' && !Array.isArray(resData.data)) {
      const fieldList = Object.entries(resData.data)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join('; ');
      if (fieldList) {
        message = `${resData.message || 'Validation failed'}: ${fieldList}`;
      }
    }

    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.fieldErrors = resData?.data;
    return Promise.reject(customError);
  }
);

export default axiosClient;
