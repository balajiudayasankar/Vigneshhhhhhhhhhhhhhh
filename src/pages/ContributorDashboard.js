import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { contributorApi } from '../api/contributorApi';
import { articleApi } from '../api/articleApi';
import { categoryApi } from '../api/categoryApi';
import { toastrService } from '../services/toastrService';

const ContributorDashboard = () => {
  const { user } = useAuth();
  const [myArticles, setMyArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    summary: '',
    categoryId: '',
    tagIds: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [recentResult, categoriesResult] = await Promise.all([
        articleApi.getRecentArticles(10),
        categoryApi.getAllCategories()
      ]);

      setRecentArticles(recentResult.data || []);
      setCategories(categoriesResult.data || []);

      // Load user's articles if they are a contributor
      if (user?.isContributor) {
        const myArticlesResult = await contributorApi.getMyArticles();
        setMyArticles(myArticlesResult.data || []);
      }
    } catch (error) {
      toastrService.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    try {
      await contributorApi.createArticle(newArticle);
      toastrService.success('Article created successfully');
      setNewArticle({ title: '', content: '', summary: '', categoryId: '', tagIds: [] });
      setShowCreateForm(false);
      loadDashboardData();
    } catch (error) {
      toastrService.error('Failed to create article');
    }
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="fas fa-home me-2 text-primary"></i>
              Welcome, {user?.name}
            </h2>
            {user?.isContributor && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                <i className="fas fa-plus me-1"></i>
                Create Article
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Create Article Modal */}
      {showCreateForm && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Article</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowCreateForm(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateArticle}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="articleTitle" className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="articleTitle"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="articleSummary" className="form-label">Summary</label>
                    <textarea
                      className="form-control"
                      id="articleSummary"
                      rows="2"
                      value={newArticle.summary}
                      onChange={(e) => setNewArticle({...newArticle, summary: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="articleCategory" className="form-label">Category</label>
                    <select
                      className="form-select"
                      id="articleCategory"
                      value={newArticle.categoryId}
                      onChange={(e) => setNewArticle({...newArticle, categoryId: parseInt(e.target.value)})}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="articleContent" className="form-label">Content</label>
                    <textarea
                      className="form-control"
                      id="articleContent"
                      rows="8"
                      value={newArticle.content}
                      onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Article
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        {/* My Articles (for contributors) */}
        {user?.isContributor && (
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-file-alt me-2"></i>
                  My Articles
                </h5>
              </div>
              <div className="card-body">
                {myArticles.length === 0 ? (
                  <p className="text-muted">You haven't created any articles yet.</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {myArticles.slice(0, 5).map((article) => (
                      <div key={article.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{article.title}</h6>
                          <small className="text-muted">
                            Status: <span className={`badge bg-${getStatusColor(article.status)}`}>
                              {article.status}
                            </span>
                          </small>
                        </div>
                        <small className="text-muted">
                          {new Date(article.createdDate).toLocaleDateString()}
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Articles */}
        <div className={`col-md-${user?.isContributor ? '6' : '12'} mb-4`}>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-clock me-2"></i>
                Recent Articles
              </h5>
            </div>
            <div className="card-body">
              {recentArticles.length === 0 ? (
                <p className="text-muted">No articles available.</p>
              ) : (
                <div className="list-group list-group-flush">
                  {recentArticles.slice(0, 5).map((article) => (
                    <div key={article.id} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">
                          <a href={`/articles/${article.id}`} className="text-decoration-none">
                            {article.title}
                          </a>
                        </h6>
                        <small className="text-muted">
                          Views: {article.viewCount}
                        </small>
                      </div>
                      <p className="mb-1 text-muted">{article.summary}</p>
                      <small className="text-muted">
                        By {article.contributorName} • {article.categoryName}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-tags me-2"></i>
                Browse by Category
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                {categories.map((category) => (
                  <div key={category.id} className="col-md-3 mb-3">
                    <div className="card border-0" style={{ backgroundColor: `${category.color}20` }}>
                      <div className="card-body text-center">
                        <div 
                          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                          style={{ 
                            width: '50px', 
                            height: '50px', 
                            backgroundColor: category.color 
                          }}
                        >
                          <i className="fas fa-folder text-white"></i>
                        </div>
                        <h6 className="card-title">{category.name}</h6>
                        <p className="card-text small text-muted">{category.description}</p>
                        <small className="text-muted">{category.articleCount || 0} articles</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contributor Status */}
      {!user?.isContributor && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-warning">
              <div className="card-body">
                <h5 className="card-title text-warning">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Become a Contributor
                </h5>
                <p className="card-text">
                  Want to share your knowledge? Request contributor access to start creating and sharing articles with the community.
                </p>
                <a href="/contributor-request" className="btn btn-warning">
                  <i className="fas fa-user-plus me-1"></i>
                  Request Contributor Access
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Draft': return 'secondary';
    case 'Submitted': return 'warning';
    case 'UnderReview': return 'info';
    case 'Approved': return 'success';
    case 'Published': return 'primary';
    case 'Rejected': return 'danger';
    default: return 'secondary';
  }
};

export default ContributorDashboard;