import { api } from '../services/authService';

export const uploadApi = {
  uploadFile: async (file, type = 'document') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  uploadArticleDocument: async (articleId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/articles/${articleId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  uploadProofDocument: async (file) => {
    try {
      const formData = new FormData();
      formData.append('proofDocument', file);

      const response = await api.post('/upload/proof-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteFile: async (fileId) => {
    try {
      const response = await api.delete(`/upload/${fileId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getFile: async (fileId) => {
    try {
      const response = await api.get(`/upload/${fileId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
