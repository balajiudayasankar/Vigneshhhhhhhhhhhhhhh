import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          <i className="fas fa-book-open me-2"></i>
          Knowledge Base
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                <i className="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </Link>
            </li>
            
            {user?.role === 'Admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  <i className="fas fa-cog me-1"></i>
                  Admin Panel
                </Link>
              </li>
            )}
            
            {user?.isContributor && (
              <li className="nav-item">
                <Link className="nav-link" to="/contributor">
                  <i className="fas fa-edit me-1"></i>
                  My Articles
                </Link>
              </li>
            )}
            
            <li className="nav-item">
              <Link className="nav-link" to="/search">
                <i className="fas fa-search me-1"></i>
                Search
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <i className="fas fa-user me-1"></i>
                {user?.name || user?.email}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <span className="dropdown-item-text">
                    <small className="text-muted">Role: {user?.role}</small>
                  </span>
                </li>
                <li><hr className="dropdown-divider" /></li>
                {!user?.isContributor && (
                  <li>
                    <Link className="dropdown-item" to="/contributor-request">
                      <i className="fas fa-user-plus me-1"></i>
                      Request Contributor Access
                    </Link>
                  </li>
                )}
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-1"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;