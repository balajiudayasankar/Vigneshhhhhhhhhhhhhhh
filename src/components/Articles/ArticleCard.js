import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatters } from '../../utils/formatters';

const ArticleCard = ({ article, showActions = false, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const statusColors = {
      'Draft': 'secondary',
      'Submitted': 'warning',
      'UnderReview': 'info',
      'Approved': 'success',
      'Published': 'primary',
      'Rejected': 'danger',
      'Archived': 'dark'
    };
    return statusColors[status] || 'secondary';
  };

  return (
    <div className="card h-100 card-hover">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className={`badge bg-${getStatusColor(article.status)}`}>
            {article.status}
          </span>
          <small className="text-muted">
            <i className="fas fa-eye me-1"></i>
            {article.viewCount || 0}
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
          {formatters.truncate(article.summary || '', 120)}
        </p>
        
        <div className="mb-2">
          <small className="text-muted">
            <i className="fas fa-user me-1"></i>
            {article.contributorName}
          </small>
          <small className="text-muted ms-3">
            <i className="fas fa-folder me-1"></i>
            {article.categoryName}
          </small>
        </div>
        
        <div className="mb-2">
          <small className="text-muted">
            <i className="fas fa-calendar me-1"></i>
            {formatters.relativeTime(article.createdDate)}
          </small>
        </div>
        
        {article.tags && article.tags.length > 0 && (
          <div className="mb-3">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="badge bg-light text-dark me-1">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="card-footer bg-transparent">
        <div className="d-flex justify-content-between align-items-center">
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/articles/${article.id}`)}
          >
            <i className="fas fa-book-open me-1"></i>
            Read More
          </button>
          
          {showActions && (
            <div className="btn-group">
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => onEdit(article)}
                title="Edit Article"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDelete(article)}
                title="Delete Article"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
