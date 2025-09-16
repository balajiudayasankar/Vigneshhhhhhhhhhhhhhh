import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { jwtService } from '../services/jwtService';
import { toastrService } from '../services/toastrService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = jwtService.getToken();
    if (token && jwtService.isTokenValid(token)) {
      const userData = jwtService.getUserFromToken(token);
      setUser(userData);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success) {
        const { token, user: userData } = response.data;
        jwtService.setToken(token);
        setUser(userData);
        setIsAuthenticated(true);
        toastrService.success('Login successful!');
        return { success: true };
      } else {
        toastrService.error(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      toastrService.error('Login failed. Please try again.');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response.success) {
        toastrService.success('Registration successful! Please login.');
        return { success: true };
      } else {
        toastrService.error(response.message || 'Registration failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      toastrService.error('Registration failed. Please try again.');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    jwtService.removeToken();
    setUser(null);
    setIsAuthenticated(false);
    toastrService.success('Logged out successfully!');
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);
      
      if (response.success) {
        toastrService.success('Password changed successfully!');
        return { success: true };
      } else {
        toastrService.error(response.message || 'Password change failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      toastrService.error('Password change failed. Please try again.');
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};