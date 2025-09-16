import { api } from '../services/authService';

export const userApi = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/user');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/user/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/user', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/user/${id}`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/user/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};