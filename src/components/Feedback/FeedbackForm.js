import React, { useState } from 'react';
import Button from '../Common/Button';
import RatingComponent from './RatingComponent';

const FeedbackForm = ({ 
  articleId, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    suggestion: '',
    isHelpful: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (onSubmit) {
      const success = await onSubmit({
        ...formData,
        articleId: parseInt(articleId)
      });
      
      if (success) {
        setFormData({
          rating: 5,
          comment: '',
          suggestion: '',
          isHelpful: true
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
      <h6 className="mb-3">
        <i className="fas fa-comment-dots me-2 text-primary"></i>
        Share Your Feedback
      </h6>
      
      <div className="mb-3">
        <label className="form-label">How would you rate this article?</label>
        <div className="d-flex align-items-center">
          <RatingComponent
            rating={formData.rating}
            onRatingChange={handleRatingChange}
            interactive={true}
            size="lg"
          />
          <span className="ms-3 text-muted">
            ({formData.rating} star{formData.rating !== 1 ? 's' : ''})
          </span>
        </div>
      </div>
      
      <div className="mb-3">
        <label htmlFor="comment" className="form-label">Your Comments</label>
        <textarea
          id="comment"
          name="comment"
          className="form-control"
          rows="4"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Share your thoughts about this article..."
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="suggestion" className="form-label">
          Suggestions for Improvement <small className="text-muted">(optional)</small>
        </label>
        <textarea
          id="suggestion"
          name="suggestion"
          className="form-control"
          rows="3"
          value={formData.suggestion}
          onChange={handleChange}
          placeholder="Any suggestions to make this article better?"
        />
      </div>
      
      <div className="mb-4">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isHelpful"
            name="isHelpful"
            checked={formData.isHelpful}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="isHelpful">
            <i className="fas fa-thumbs-up me-1 text-success"></i>
            This article was helpful to me
          </label>
        </div>
      </div>
      
      <div className="d-flex gap-2">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon="fas fa-paper-plane"
        >
          Submit Feedback
        </Button>
        
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
      
      <div className="mt-3 p-3 bg-info bg-opacity-10 rounded">
        <small className="text-muted">
          <i className="fas fa-info-circle me-1"></i>
          <strong>Your feedback helps:</strong> Authors improve their content and other users find valuable articles.
        </small>
      </div>
    </form>
  );
};

export default FeedbackForm;
