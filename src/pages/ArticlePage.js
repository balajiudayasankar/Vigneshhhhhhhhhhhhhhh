import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticle } from '../context/ArticleContext';
import { feedbackApi } from '../api/feedbackApi';
import { useAuth } from '../context/AuthContext';
import { toastrService } from '../services/toastrService';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getArticleById, currentArticle, loading } = useArticle();
  
  const [feedback, setFeedback] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userFeedback, setUserFeedback] = useState({
    rating: 5,
    comment: '',
    suggestion: '',
    isHelpful: true
  });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (id) {
      loadArticle();
      loadFeedback();
      loadAverageRating();
    }
  }, [id]);

  const loadArticle = async () => {
    await getArticleById(parseInt(id));
  };

  const loadFeedback = async () => {
    try {
      const response = await feedbackApi.getFeedbackByArticle(id);
      if (response.success) {
        setFeedback(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load feedback');
    }
  };

  const loadAverageRating = async () => {
    try {
      const response = await feedbackApi.getAverageRating(id);
      if (response.success) {
        setAverageRating(response.data || 0);
      }
    } catch (error) {
      console.error('Failed to load average rating');
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);

    try {
      const feedbackData = {
        ...userFeedback,
        articleId: parseInt(id)
      };

      const response = await feedbackApi.createFeedback(feedbackData);
      if (response.success) {
        toastrService.success('Feedback submitted successfully!');
        setShowFeedbackForm(false);
        setUserFeedback({
          rating: 5,
          comment: '',
          suggestion: '',
          isHelpful: true
        });
        loadFeedback();
        loadAverageRating();
      }
    } catch (error) {
      toastrService.error('Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleFeedbackChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserFeedback(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  if (!currentArticle) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Article Not Found</h4>
          <p>The article you're looking for doesn't exist or has been removed.</p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          {/* Article Content */}
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <span className="badge bg-primary mb-2">{currentArticle.categoryName}</span>
                  <h1 className="h3 mb-0">{currentArticle.title}</h1>
                </div>
                <div className="text-end">
                  <div className="d-flex align-items-center mb-2">
                    <div className="me-3">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star ${i < Math.round(averageRating) ? 'text-warning' : 'text-muted'}`}
                        ></i>
                      ))}
                      <span className="ms-2 text-muted">({averageRating.toFixed(1)})</span>
                    </div>
                    <small className="text-muted">
                      <i className="fas fa-eye me-1"></i>
                      {currentArticle.viewCount} views
                    </small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-body">
              {/* Article Meta */}
              <div className="mb-4 pb-3 border-bottom">
                <div className="row">
                  <div className="col-md-6">
                    <small className="text-muted">
                      <i className="fas fa-user me-1"></i>
                      By <strong>{currentArticle.contributorName}</strong>
                    </small>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <small className="text-muted">
                      <i className="fas fa-calendar me-1"></i>
                      {new Date(currentArticle.createdDate).toLocaleDateString()}
                      {currentArticle.updatedDate && (
                        <span className="ms-2">
                          (Updated: {new Date(currentArticle.updatedDate).toLocaleDateString()})
                        </span>
                      )}
                    </small>
                  </div>
                </div>
              </div>

              {/* Article Summary */}
              {currentArticle.summary && (
                <div className="alert alert-info">
                  <h6><i className="fas fa-info-circle me-1"></i>Summary</h6>
                  <p className="mb-0">{currentArticle.summary}</p>
                </div>
              )}

              {/* Article Content */}
              <div className="article-content">
                <div dangerouslySetInnerHTML={{ __html: currentArticle.content.replace(/\n/g, '<br>') }} />
              </div>

              {/* Tags */}
              {currentArticle.tags && currentArticle.tags.length > 0 && (
                <div className="mt-4 pt-3 border-top">
                  <h6>Tags:</h6>
                  {currentArticle.tags.map((tag, index) => (
                    <span key={index} className="badge bg-light text-dark me-2">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="card mt-4">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-comments me-2"></i>
                  Feedback ({feedback.length})
                </h5>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                >
                  <i className="fas fa-plus me-1"></i>
                  Add Feedback
                </button>
              </div>
            </div>
            
            <div className="card-body">
              {/* Feedback Form */}
              {showFeedbackForm && (
                <form onSubmit={handleSubmitFeedback} className="mb-4 p-3 border rounded">
                  <h6>Share Your Feedback</h6>
                  
                  <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <div>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="btn btn-link p-0 me-1"
                          onClick={() => setUserFeedback(prev => ({ ...prev, rating }))}
                        >
                          <i className={`fas fa-star ${rating <= userFeedback.rating ? 'text-warning' : 'text-muted'}`}></i>
                        </button>
                      ))}
                      <span className="ms-2">({userFeedback.rating} star{userFeedback.rating !== 1 ? 's' : ''})</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Comment</label>
                    <textarea
                      id="comment"
                      name="comment"
                      className="form-control"
                      rows="3"
                      value={userFeedback.comment}
                      onChange={handleFeedbackChange}
                      placeholder="Share your thoughts about this article..."
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="suggestion" className="form-label">Suggestions for Improvement</label>
                    <textarea
                      id="suggestion"
                      name="suggestion"
                      className="form-control"
                      rows="2"
                      value={userFeedback.suggestion}
                      onChange={handleFeedbackChange}
                      placeholder="Any suggestions to make this article better?"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isHelpful"
                        name="isHelpful"
                        checked={userFeedback.isHelpful}
                        onChange={handleFeedbackChange}
                      />
                      <label className="form-check-label" htmlFor="isHelpful">
                        This article was helpful
                      </label>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={submittingFeedback}
                    >
                      {submittingFeedback ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1"></span>
                          Submitting...
                        </>
                      ) : (
                        'Submit Feedback'
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowFeedbackForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Feedback List */}
              {feedback.length === 0 ? (
                <p className="text-muted text-center py-3">
                  No feedback yet. Be the first to share your thoughts!
                </p>
              ) : (
                <div>
                  {feedback.map((fb) => (
                    <div key={fb.id} className="border-bottom pb-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong>{fb.userName}</strong>
                          <div>
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`fas fa-star fa-sm ${i < fb.rating ? 'text-warning' : 'text-muted'}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <small className="text-muted">
                          {new Date(fb.createdDate).toLocaleDateString()}
                        </small>
                      </div>
                      
                      {fb.comment && (
                        <p className="mb-2">{fb.comment}</p>
                      )}
                      
                      {fb.suggestion && (
                        <div className="alert alert-light py-2">
                          <small>
                            <strong>Suggestion:</strong> {fb.suggestion}
                          </small>
                        </div>
                      )}
                      
                      {fb.isHelpful && (
                        <small className="text-success">
                          <i className="fas fa-thumbs-up me-1"></i>
                          Found this helpful
                        </small>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Article Information</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Category:</strong> {currentArticle.categoryName}
                </li>
                <li className="mb-2">
                  <strong>Author:</strong> {currentArticle.contributorName}
                </li>
                <li className="mb-2">
                  <strong>Published:</strong> {new Date(currentArticle.createdDate).toLocaleDateString()}
                </li>
                <li className="mb-2">
                  <strong>Views:</strong> {currentArticle.viewCount}
                </li>
                <li className="mb-2">
                  <strong>Rating:</strong> {averageRating.toFixed(1)}/5.0
                </li>
                <li className="mb-2">
                  <strong>Status:</strong> 
                  <span className="badge bg-success ms-2">{currentArticle.status}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mt-3">
            <div className="card-header">
              <h6 className="mb-0">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => window.print()}
                >
                  <i className="fas fa-print me-1"></i>
                  Print Article
                </button>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toastrService.success('Link copied to clipboard!');
                  }}
                >
                  <i className="fas fa-share me-1"></i>
                  Share Article
                </button>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate('/search')}
                >
                  <i className="fas fa-search me-1"></i>
                  Find Similar Articles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
