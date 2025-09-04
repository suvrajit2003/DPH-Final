import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials:true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Chatbot Category API methods - CORRECTED ENDPOINTS
export const chatbotCategoryAPI = {
  // Get all categories with optional pagination and search
  getAll: (page = 1, limit = 10, search = '') => {
    const params = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (search) params.search = search;

    return api.get('/chatbot-categories', { params });
  },

  // Get single category
  get: (id) => {
    return api.get(`/chatbot-categories/${id}`);
  },

  // Create new category - CORRECTED ENDPOINT
  create: (data) => {
    return api.post('/chatbot-categories', data);
  },

  // Update category - CORRECTED ENDPOINT
  update: (id, data) => {
    return api.put(`/chatbot-categories/${id}`, data);
  },

  // Delete category - CORRECTED ENDPOINT
  delete: (id) => {
    return api.delete(`/chatbot-categories/${id}`);
  },

  // Update category order - CORRECTED ENDPOINT
  updateOrder: (data) => {
    return api.patch('/chatbot-categories/order', data);
  },
};

export default api;