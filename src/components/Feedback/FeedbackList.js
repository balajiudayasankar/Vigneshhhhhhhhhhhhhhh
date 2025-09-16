import React, { useState } from 'react';
import RatingComponent from './RatingComponent';
import { formatters } from '../../utils/formatters';
import { helpers } from '../../utils/helpers';
import LoadingSpinner from '../Common/LoadingSpinner';

const FeedbackList = ({ 
  feedback = [], 
  loading = false,
  showArticleInfo = false 
}) => {
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState('all');

  const filteredFeedback = feedback
    .filter(fb => {
      if (filterRating === 'all') return true;
      const rating = parseInt(filterRating);
      return fb.rating === rating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdDate) - new Date(a.createdDate);
        case 'oldest':
          return new Date(a.createdDate) - new Date(b.createdDate);
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  if (loading) {
    return <LoadingSpinner text="Loading feedback..." />;
  }

  if (feedback.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-comments fa-3x text-muted mb-3"></i>
        <h5>No Feedback Yet</h5>
        <p className="text-muted">
          Be the first to share your thoughts on this content!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="row mb-4">
        <div className="col-md-6">
          <select 
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>
        
        <div className="col-md-6">
          <select 
            className="form-select"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Feedback Stats */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body py-3">
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="h4 mb-0 text-primary">{feedback.length}</div>
                  <small className="text-muted">Total Feedback</small>
                </div>
                <div className="col-md-3">
                  <div className="h4 mb-0 text-warning">
                    {feedback.length > 0 ? 
                      (feedback.reduce((sum, fb) => sum + fb.rating, 0) / feedback.length).toFixed(1) : 
                      '0.0'
                    }
                  </div>
                  <small className="text-muted">Average Rating</small>
                </div>
                <div className="col-md-3">
                  <div className="h4 mb-0 text-success">
                    {feedback.filter(fb => fb.isHelpful).length}
                  </div>
                  <small className="text-muted">Found Helpful</small>
                </div>
                <div className="col-md-3">
                  <div className="h4 mb-0 text-info">
                    {feedback.filter(fb => fb.suggestion && fb.suggestion.trim()).length}
                  </div>
                  <small className="text-muted">With Suggestions</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Items */}
      <div className="feedback-list">
        {filteredFeedback.length === 0 ? (
          <div className="text-center py-4">
            <i className="fas fa-filter fa-2x text-muted mb-3"></i>
            <h5>No feedback matches your filters</h5>
            <p className="text-muted">Try adjusting your filter options.</p>
          </div>
        ) : (
          filteredFeedback.map((fb) => (
            <div key={fb.id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex align-items-start">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '45px',
                      height: '45px',
                      backgroundColor: helpers.getAvatarColor(fb.userName),
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    {helpers.getInitials(fb.userName)}
                  </div>
                  
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-1">{fb.userName}</h6>
                        <div className="d-flex align-items-center">
                          <RatingComponent rating={fb.rating} interactive={false} />
                          <span className="ms-2 text-muted">
                            {formatters.relativeTime(fb.createdDate)}
                          </span>
                        </div>
                      </div>
                      
                      {fb.isHelpful && (
                        <span className="badge bg-success">
                          <i className="fas fa-thumbs-up me-1"></i>
                          Helpful
                        </span>
                      )}
                    </div>

                    {showArticleInfo && fb.articleTitle && (
                      <div className="mb-2">
                        <small className="text-muted">
                          <i className="fas fa-file-alt me-1"></i>
                          On: <strong>{fb.articleTitle}</strong>
                        </small>
                      </div>
                    )}
                    
                    {fb.comment && (
                      <div className="mb-3">
                        <p className="mb-0">{fb.comment}</p>
                      </div>
                    )}
                    
                    {fb.suggestion && (
                      <div className="alert alert-light py-2 mb-2">
                        <strong><i className="fas fa-lightbulb me-1 text-warning"></i>Suggestion:</strong>
                        <p className="mb-0 mt-1">{fb.suggestion}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
