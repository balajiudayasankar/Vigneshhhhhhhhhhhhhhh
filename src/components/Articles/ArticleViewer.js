import React, { useState } from 'react';
import { formatters } from '../../utils/formatters';

const ArticleViewer = ({ article, onClose }) => {
  const [fontSize, setFontSize] = useState('normal');
  
  const fontSizes = {
    small: '14px',
    normal: '16px',
    large: '18px',
    xlarge: '20px'
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!article) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
        <h4>Article Not Found</h4>
        <p className="text-muted">The article you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="article-viewer">
      {/* Article Header */}
      <div className="article-header mb-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <span className="badge bg-primary mb-2">{article.categoryName}</span>
            <h1 className="h2 mb-2">{article.title}</h1>
          </div>
          
          <div className="article-controls">
            <div className="btn-group me-2">
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setFontSize('small')}
                title="Small Font"
              >
                A-
              </button>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setFontSize('normal')}
                title="Normal Font"
              >
                A
              </button>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setFontSize('large')}
                title="Large Font"
              >
                A+
              </button>
            </div>
            
            <div className="btn-group">
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={handlePrint}
                title="Print Article"
              >
                <i className="fas fa-print"></i>
              </button>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={handleShare}
                title="Share Article"
              >
                <i className="fas fa-share"></i>
              </button>
              {onClose && (
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={onClose}
                  title="Close"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Article Meta */}
        <div className="article-meta border-bottom pb-3 mb-4">
          <div className="row">
            <div className="col-md-8">
              <div className="d-flex align-items-center">
                <div className="me-4">
                  <i className="fas fa-user me-1 text-muted"></i>
                  <strong>{article.contributorName}</strong>
                </div>
                <div className="me-4">
                  <i className="fas fa-calendar me-1 text-muted"></i>
                  {formatters.date(article.createdDate)}
                </div>
                <div>
                  <i className="fas fa-eye me-1 text-muted"></i>
                  {article.viewCount} views
                </div>
              </div>
            </div>
            
            <div className="col-md-4 text-md-end">
              {article.updatedDate && (
                <small className="text-muted">
                  Updated: {formatters.relativeTime(article.updatedDate)}
                </small>
              )}
            </div>
          </div>
        </div>

        {/* Article Summary */}
        {article.summary && (
          <div className="alert alert-info">
            <h6><i className="fas fa-info-circle me-1"></i>Summary</h6>
            <p className="mb-0">{article.summary}</p>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div 
        className="article-content" 
        style={{ fontSize: fontSizes[fontSize], lineHeight: '1.6' }}
      >
        <div 
          dangerouslySetInnerHTML={{ 
            __html: article.content.replace(/\n/g, '<br>') 
          }} 
        />
      </div>

      {/* Article Footer */}
      <div className="article-footer mt-5 pt-4 border-top">
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-3">
            <h6>Tags:</h6>
            {article.tags.map((tag, index) => (
              <span key={index} className="badge bg-light text-dark me-2">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Article Stats */}
        <div className="row">
          <div className="col-md-6">
            <div className="card bg-light">
              <div className="card-body py-3">
                <div className="row text-center">
                  <div className="col-4">
                    <div className="h5 mb-0">{article.viewCount}</div>
                    <small className="text-muted">Views</small>
                  </div>
                  <div className="col-4">
                    <div className="h5 mb-0">{article.feedbackCount || 0}</div>
                    <small className="text-muted">Feedback</small>
                  </div>
                  <div className="col-4">
                    <div className="h5 mb-0">{article.averageRating || 0}</div>
                    <small className="text-muted">Rating</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="text-md-end">
              <p className="mb-1">
                <strong>Category:</strong> {article.categoryName}
              </p>
              <p className="mb-1">
                <strong>Published:</strong> {formatters.date(article.createdDate)}
              </p>
              <p className="mb-0">
                <strong>Author:</strong> {article.contributorName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleViewer;
