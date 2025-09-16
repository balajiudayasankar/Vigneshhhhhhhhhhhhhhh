import { api } from '../services/authService';

export const contributorApi = {
  requestContributorAccess: async (requestData) => {
    try {
      const response = await api.post('/contributor/request', requestData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  approveContributor: async (contributorId, approvalData) => {
    try {
      const response = await api.post(`/contributor/${contributorId}/approve`, approvalData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getPendingApprovals: async () => {
    try {
      const response = await api.get('/contributor/pending');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getApprovedContributors: async () => {
    try {
      const response = await api.get('/contributor/approved');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getMyContributorProfile: async () => {
    try {
      const response = await api.get('/contributor/me');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getMyArticles: async () => {
    try {
      const response = await api.get('/contributor/me/articles');
      return response;
    } catch (error) {
      throw error;
    }
  },

  createArticle: async (articleData) => {
    try {
      const response = await api.post('/contributor/articles', articleData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateArticle: async (articleId, articleData) => {
    try {
      const response = await api.put(`/contributor/articles/${articleId}`, articleData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteArticle: async (articleId) => {
    try {
      const response = await api.delete(`/contributor/articles/${articleId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};