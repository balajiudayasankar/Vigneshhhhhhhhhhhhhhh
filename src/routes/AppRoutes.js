import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../context/AuthContext';

// Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminDashboard from '../pages/AdminDashboard';
import ContributorDashboard from '../pages/ContributorDashboard';
import ArticlePage from '../pages/ArticlePage';
import SearchResultsPage from '../pages/SearchResultsPage';
import ContributorRequestPage from '../pages/ContributorRequestPage';
import NotFoundPage from '../pages/NotFoundPage';

// Components
import Navbar from '../components/Common/Navbar';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />} 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              {user?.role === 'Admin' ? <AdminDashboard /> : <ContributorDashboard />}
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <PrivateRoute requiredRole="Admin">
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/contributor" 
          element={
            <PrivateRoute>
              <ContributorDashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/articles/:id" 
          element={
            <PrivateRoute>
              <ArticlePage />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/search" 
          element={
            <PrivateRoute>
              <SearchResultsPage />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/contributor-request" 
          element={
            <PrivateRoute>
              <ContributorRequestPage />
            </PrivateRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/unauthorized" element={<div className="container mt-5"><h3 className="text-danger">Unauthorized Access</h3></div>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;