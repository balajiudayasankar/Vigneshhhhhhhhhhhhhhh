import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <div className="mb-4">
                  <i className="fas fa-search fa-5x text-primary mb-3"></i>
                  <h1 className="display-1 fw-bold text-primary">404</h1>
                </div>
                
                <h2 className="h3 mb-3">Page Not Found</h2>
                <p className="text-muted mb-4">
                  Oops! The page you're looking for doesn't exist. It might have been moved, 
                  deleted, or you entered the wrong URL.
                </p>
                
                <div className="d-grid gap-2 d-md-block">
                  <button 
                    className="btn btn-primary me-2"
                    onClick={() => navigate('/dashboard')}
                  >
                    <i className="fas fa-home me-1"></i>
                    Go to Dashboard
                  </button>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate(-1)}
                  >
                    <i className="fas fa-arrow-left me-1"></i>
                    Go Back
                  </button>
                </div>
                
                <hr className="my-4" />
                
                <div className="row text-center">
                  <div className="col-md-4 mb-3">
                    <i className="fas fa-search fa-2x text-primary mb-2"></i>
                    <h6>Search Articles</h6>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => navigate('/search')}
                    >
                      Search Now
                    </button>
                  </div>
                  <div className="col-md-4 mb-3">
                    <i className="fas fa-book fa-2x text-primary mb-2"></i>
                    <h6>Browse Categories</h6>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => navigate('/search')}
                    >
                      Browse
                    </button>
                  </div>
                  <div className="col-md-4 mb-3">
                    <i className="fas fa-question-circle fa-2x text-primary mb-2"></i>
                    <h6>Need Help?</h6>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => navigate('/dashboard')}
                    >
                      Contact Support
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-light rounded">
                  <small className="text-muted">
                    <i className="fas fa-lightbulb me-1"></i>
                    <strong>Tip:</strong> Try using the search function to find what you're looking for, 
                    or browse our categories to discover relevant content.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
