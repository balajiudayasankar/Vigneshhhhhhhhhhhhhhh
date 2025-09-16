import { api } from '../services/authService';

export const feedbackApi = {
  createFeedback: async (feedbackData) => {
    try {
      const response = await api.post('/feedback', feedbackData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getFeedbackByArticle: async (articleId) => {
    try {
      const response = await api.get(`/feedback/article/${articleId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getFeedbackByUser: async (userId) => {
    try {
      const response = await api.get(`/feedback/user/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateFeedback: async (feedbackId, feedbackData) => {
    try {
      const response = await api.put(`/feedback/${feedbackId}`, feedbackData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteFeedback: async (feedbackId) => {
    try {
      const response = await api.delete(`/feedback/${feedbackId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAverageRating: async (articleId) => {
    try {
      const response = await api.get(`/analytics/articles/${articleId}/rating`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
