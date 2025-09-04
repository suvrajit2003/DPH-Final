import api from './api';

// Chatbot Answer API methods
export const chatbotAnswerAPI = {
  // Get all answers with optional pagination, search, and filters
  getAll: (page = 1, limit = 10, search = '', category_id = '', question_id = '') => {
    const params = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (search) params.search = search;
    if (category_id) params.category_id = category_id;
    if (question_id) params.question_id = question_id;

    return api.get('/chatbot-answers', { params });
  },

  // Get single answer
  get: (id) => {
    return api.get(`/chatbot-answers/${id}`);
  },

  // Create new answer
  create: (data) => {
    return api.post('/chatbot-answers', data);
  },

  // Update answer
  update: (id, data) => {
    return api.put(`/chatbot-answers/${id}`, data);
  },

  // Delete answer
  delete: (id) => {
    return api.delete(`/chatbot-answers/${id}`);
  },

  // Get answers by category
  getByCategory: (category_id) => {
    return api.get(`/chatbot-answers/category/${category_id}`);
  },

  // Get answers by question
  getByQuestion: (question_id) => {
    return api.get(`/chatbot-answers/question/${question_id}`);
  },

  // Get questions by category (for dropdown)
  getQuestionsByCategory: (category_id) => {
    return api.get(`/chatbot-answers/questions/${category_id}`);
  }
};

export default chatbotAnswerAPI;