import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryApi } from '../api/categoryApi';
import { articleApi } from '../api/articleApi';
import { toastrService } from '../services/toastrService';

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articlesLoading, setArticlesLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadCategory();
      loadCategoryArticles();
    }
  }, [id]);

  const loadCategory = async () => {
    try {
      const response = await categoryApi.getAllCategories();
      if (response.success) {
        const foundCategory = response.data.find(cat => cat.id === parseInt(id));
        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          navigate('/dashboard');
          toastrService.error('Category not found');
        }
      }
    } catch (error) {
      toastrService.error('Failed to load category');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryArticles = async () => {
    try {
      setArticlesLoading(true);
      // This endpoint might need to be created in your backend
      const response = await articleApi.getPublishedArticles();
      if (response.success) {
        // Filter articles by category
        const categoryArticles = response.data.filter(
          article => article.categoryName === category?.name
        );
        setArticles(categoryArticles);
      }
    } catch (error) {
      console.error('Failed to load category articles');
    } finally {
      setArticlesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Category Not Found</h4>
          <p>The category you're looking for doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Category Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0" style={{ backgroundColor: `${category.color}20` }}>
            <div className="card-body text-center py-5">
              <div 
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: category.color 
                }}
              >
                <i className="fas fa-folder text-white fa-2x"></i>
              </div>
              <h1 className="display-4 mb-3">{category.name}</h1>
              <p className="lead mb-3">{category.description}</p>
              <p className="text-muted">
                <i className="fas fa-file-alt me-2"></i>
                {articles.length} article{articles.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="row mb-4">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/dashboard" className="text-decoration-none">Dashboard</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/search" className="text-decoration-none">Categories</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {category.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Articles */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>
              <i className="fas fa-list me-2"></i>
              Articles in {category.name}
            </h3>
            <div className="btn-group" role="group">
              <button type="button" className="btn btn-outline-secondary btn-sm active">
                <i className="fas fa-th-large me-1"></i>
                Grid View
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm">
                <i className="fas fa-list me-1"></i>
                List View
              </button>
            </div>
          </div>

          {articlesLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading articles...</span>
              </div>
              <p className="mt-2">Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
                <h4>No Articles Found</h4>
                <p className="text-muted">
                  There are no published articles in this category yet.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/search')}
                >
                  Browse Other Categories
                </button>
              </div>
            </div>
          ) : (
            <div className="row">
              {articles.map((article) => (
                <div key={article.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 card-hover">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span 
                          className="badge rounded-pill"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name}
                        </span>
                        <small className="text-muted">
                          <i className="fas fa-eye me-1"></i>
                          {article.viewCount}
                        </small>
                      </div>
                      
                      <h5 className="card-title">
                        <a 
                          href={`/articles/${article.id}`} 
                          className="text-decoration-none"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/articles/${article.id}`);
                          }}
                        >
                          {article.title}
                        </a>
                      </h5>
                      
                      <p className="card-text text-muted">
                        {article.summary}
                      </p>
                      
                      <div className="mt-auto">
                        <small className="text-muted">
                          By {article.contributorName} • 
                          {new Date(article.createdDate).toLocaleDateString()}
                        </small>
                      </div>
                      
                      {article.tags && article.tags.length > 0 && (
                        <div className="mt-2">
                          {article.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="badge bg-light text-dark me-1">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="card-footer bg-transparent">
                      <button 
                        className="btn btn-primary btn-sm w-100"
                        onClick={() => navigate(`/articles/${article.id}`)}
                      >
                        <i className="fas fa-book-open me-1"></i>
                        Read Article
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Categories */}
      {category && (
        <div className="row mt-5">
          <div className="col-12">
            <h4>Explore More Categories</h4>
            <div className="text-center mt-3">
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate('/search')}
              >
                <i className="fas fa-search me-1"></i>
                Browse All Categories
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
