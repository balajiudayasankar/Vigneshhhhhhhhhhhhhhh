import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { feedbackApi } from '../api/feedbackApi';
import { toastrService } from '../services/toastrService';

const FeedbackPage = () => {
  const { user } = useAuth();
  const [myFeedback, setMyFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-feedback');

  useEffect(() => {
    loadMyFeedback();
  }, []);

  const loadMyFeedback = async () => {
    try {
      setLoading(true);
      const response = await feedbackApi.getFeedbackByUser(user.id);
      if (response.success) {
        setMyFeedback(response.data || []);
      }
    } catch (error) {
      toastrService.error('Failed to load your feedback');
    } finally {
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i 
        key={i} 
        className={`fas fa-star ${i < rating ? 'text-warning' : 'text-muted'}`}
      ></i>
    ));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Published': { class: 'bg-success', icon: 'fa-check-circle' },
      'Draft': { class: 'bg-secondary', icon: 'fa-edit' },
      'UnderReview': { class: 'bg-warning', icon: 'fa-clock' },
      'Rejected': { class: 'bg-danger', icon: 'fa-times-circle' }
    };

    const config = statusConfig[status] || { class: 'bg-secondary', icon: 'fa-question' };
    
    return (
      <span className={`badge ${config.class}`}>
        <i className={`fas ${config.icon} me-1`}></i>
        {status}
      </span>
    );
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

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">
            <i className="fas fa-comments me-2 text-primary"></i>
            My Feedback
          </h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{myFeedback.length}</h4>
                  <p className="card-text">Total Feedback</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-comment fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">
                    {myFeedback.filter(f => f.isHelpful).length}
                  </h4>
                  <p className="card-text">Helpful Reviews</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-thumbs-up fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">
                    {myFeedback.length > 0 ? 
                      (myFeedback.reduce((sum, f) => sum + f.rating, 0) / myFeedback.length).toFixed(1) : 
                      '0.0'
                    }
                  </h4>
                  <p className="card-text">Average Rating</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-star fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">
                    {myFeedback.filter(f => f.suggestion && f.suggestion.trim()).length}
                  </h4>
                  <p className="card-text">With Suggestions</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-lightbulb fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-list me-2"></i>
                Your Feedback History
              </h5>
            </div>
            <div className="card-body">
              {myFeedback.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                  <h4>No Feedback Yet</h4>
                  <p className="text-muted">
                    You haven't provided any feedback yet. Start reading articles and share your thoughts!
                  </p>
                  <a href="/search" className="btn btn-primary">
                    <i className="fas fa-search me-1"></i>
                    Browse Articles
                  </a>
                </div>
              ) : (
                <div className="row">
                  {myFeedback.map((feedback) => (
                    <div key={feedback.id} className="col-lg-6 mb-4">
                      <div className="card border-left-primary h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0">
                              <a 
                                href={`/articles/${feedback.articleId}`} 
                                className="text-decoration-none"
                              >
                                {feedback.articleTitle}
                              </a>
                            </h6>
                            <small className="text-muted">
                              {new Date(feedback.createdDate).toLocaleDateString()}
                            </small>
                          </div>
                          
                          <div className="mb-2">
                            <div className="d-flex align-items-center">
                              <span className="me-2">Rating:</span>
                              {getRatingStars(feedback.rating)}
                              <span className="ms-2 text-muted">({feedback.rating}/5)</span>
                            </div>
                          </div>
                          
                          {feedback.comment && (
                            <div className="mb-2">
                              <strong>Comment:</strong>
                              <p className="text-muted mb-2">{feedback.comment}</p>
                            </div>
                          )}
                          
                          {feedback.suggestion && (
                            <div className="mb-2">
                              <strong>Suggestion:</strong>
                              <div className="alert alert-light py-2">
                                <small>{feedback.suggestion}</small>
                              </div>
                            </div>
                          )}
                          
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            {feedback.isHelpful ? (
                              <span className="badge bg-success">
                                <i className="fas fa-thumbs-up me-1"></i>
                                Found Helpful
                              </span>
                            ) : (
                              <span className="badge bg-light text-dark">
                                <i className="fas fa-thumbs-down me-1"></i>
                                Not Helpful
                              </span>
                            )}
                            
                            <a 
                              href={`/articles/${feedback.articleId}`}
                              className="btn btn-outline-primary btn-sm"
                            >
                              <i className="fas fa-book-open me-1"></i>
                              Read Article
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Guidelines */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Feedback Guidelines
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>How to Write Good Feedback:</h6>
                  <ul className="small">
                    <li>Be specific about what you found helpful or unhelpful</li>
                    <li>Provide constructive suggestions for improvement</li>
                    <li>Rate based on content quality and usefulness</li>
                    <li>Keep comments professional and respectful</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Rating Scale:</h6>
                  <ul className="small">
                    <li><strong>5 Stars:</strong> Excellent, very helpful content</li>
                    <li><strong>4 Stars:</strong> Good content with minor improvements needed</li>
                    <li><strong>3 Stars:</strong> Average, moderately helpful</li>
                    <li><strong>2 Stars:</strong> Below average, significant improvements needed</li>
                    <li><strong>1 Star:</strong> Poor quality, not helpful</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
