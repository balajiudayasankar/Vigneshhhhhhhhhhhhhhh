import axios from 'axios';
import { jwtService } from '../services/jwtService';
import { toastrService } from '../services/toastrService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = jwtService.getToken();
    if (token && jwtService.isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    
    // Log successful requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    
    return response.data;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          jwtService.removeToken();
          toastrService.error('Session expired. Please login again.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          break;
          
        case 403:
          // Forbidden
          toastrService.error('You do not have permission to perform this action.');
          break;
          
        case 404:
          // Not found
          toastrService.error('Resource not found.');
          break;
          
        case 422:
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach(err => toastrService.error(err));
          } else {
            toastrService.error('Validation failed.');
          }
          break;
          
        case 500:
          // Server error
          toastrService.error('Server error. Please try again later.');
          break;
          
        default:
          toastrService.error(data.message || 'An unexpected error occurred.');
      }
      
      return Promise.reject(data || error.response);
    } else if (error.request) {
      // Request made but no response received
      toastrService.error('Network error. Please check your connection.');
      return Promise.reject({ message: 'Network error' });
    } else {
      // Something else happened
      toastrService.error('An unexpected error occurred.');
      return Promise.reject(error);
    }
  }
);

// Helper methods
export const apiHelpers = {
  // GET request
  get: (url, config = {}) => {
    return apiClient.get(url, config);
  },
  
  // POST request
  post: (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
  },
  
  // PUT request
  put: (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
  },
  
  // DELETE request
  delete: (url, config = {}) => {
    return apiClient.delete(url, config);
  },
  
  // PATCH request
  patch: (url, data = {}, config = {}) => {
    return apiClient.patch(url, data, config);
  },
  
  // Upload file
  upload: (url, formData, config = {}) => {
    return apiClient.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
    });
  },
  
  // Download file
  download: (url, filename, config = {}) => {
    return apiClient.get(url, {
      ...config,
      responseType: 'blob',
    }).then(response => {
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return response;
    });
  }
};

export default apiClient;
