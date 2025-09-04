
import api from "./api";

const importantLinksAPI = {
  getAll: (page = 1, limit = 10, search = "") => {
    return api.get(`/important-links`, {
      params: { page, limit, search },
    });
  },

  get: (id) => {
    return api.get(`/important-links/${id}`);
  },

  create: (formData) => {
    return api.post(`/important-links`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: (id, formData) => {
    return api.put(`/important-links/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete: (id) => {
    return api.delete(`/important-links/${id}`);
  },

  updateStatus: (id, status) => {
    return api.patch(`/important-links/${id}/status`, { status });
  },
};

export default importantLinksAPI;