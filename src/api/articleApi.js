import { api } from '../services/authService';

export const articleApi = {
  getPublishedArticles: async () => {
    try {
      const response = await api.get('/analytics/articles/recent?count=50');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getArticleById: async (id) => {
    try {
      const response = await api.get(`/article/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  searchArticles: async (searchTerm) => {
    try {
      const response = await api.get(`/article/search?term=${encodeURIComponent(searchTerm)}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getMostViewedArticles: async (count = 10) => {
    try {
      const response = await api.get(`/analytics/articles/most-viewed?count=${count}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getRecentArticles: async (count = 10) => {
    try {
      const response = await api.get(`/analytics/articles/recent?count=${count}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  incrementViewCount: async (articleId) => {
    try {
      const response = await api.post(`/article/${articleId}/increment-view`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};