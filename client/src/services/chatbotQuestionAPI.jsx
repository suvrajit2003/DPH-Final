import api from './api'; // Import the base axios instance

// Chatbot Question API methods
export const chatbotQuestionAPI = {
  // Get all questions with optional pagination, search, and category filter
  getAll: (page = 1, limit = 10, search = '', category_id = '') => {
    const params = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (search) params.search = search;
    if (category_id) params.category_id = category_id;

    return api.get('/chatbot-questions', { params });
  },

  // Get single question
  get: (id) => {
    return api.get(`/chatbot-questions/${id}`);
  },

  // Create new question
  create: (data) => {
    return api.post('/chatbot-questions', data);
  },

  // Update question
  update: (id, data) => {
    return api.put(`/chatbot-questions/${id}`, data);
  },

  // Delete question
  delete: (id) => {
    return api.delete(`/chatbot-questions/${id}`);
  },

  // Update question order
  updateOrder: (data) => {
    return api.patch('/chatbot-questions/order', data);
  },

  // Get questions by category
  getByCategory: (category_id) => {
    return api.get(`/chatbot-questions/category/${category_id}`);
  }
};

export default chatbotQuestionAPI;