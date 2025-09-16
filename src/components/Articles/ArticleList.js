import React, { useState } from 'react';
import ArticleCard from './ArticleCard';
import Pagination from '../Common/Pagination';
import LoadingSpinner from '../Common/LoadingSpinner';

const ArticleList = ({ 
  articles = [], 
  loading = false, 
  showActions = false,
  onEdit = null,
  onDelete = null,
  itemsPerPage = 9 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  if (loading) {
    return <LoadingSpinner text="Loading articles..." />;
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
        <h4>No Articles Found</h4>
        <p className="text-muted">
          No articles match your criteria. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with view controls */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p className="text-muted mb-0">
            Showing {startIndex + 1}-{Math.min(endIndex, articles.length)} of {articles.length} articles
          </p>
        </div>
        
        <div className="btn-group" role="group">
          <button 
            type="button" 
            className={`btn btn-outline-secondary btn-sm ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <i className="fas fa-th me-1"></i>
            Grid
          </button>
          <button 
            type="button" 
            className={`btn btn-outline-secondary btn-sm ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <i className="fas fa-list me-1"></i>
            List
          </button>
        </div>
      </div>

      {/* Articles Grid/List */}
      {viewMode === 'grid' ? (
        <div className="row">
          {currentArticles.map((article) => (
            <div key={article.id} className="col-lg-4 col-md-6 mb-4">
              <ArticleCard
                article={article}
                showActions={showActions}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="list-group">
          {currentArticles.map((article) => (
            <div key={article.id} className="list-group-item">
              <div className="d-flex w-100 justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="mb-1">
                    <a href={`/articles/${article.id}`} className="text-decoration-none">
                      {article.title}
                    </a>
                  </h6>
                  <p className="mb-1 text-muted">{article.summary}</p>
                  <small className="text-muted">
                    By {article.contributorName} • {article.categoryName} • 
                    <i className="fas fa-eye ms-1 me-1"></i>{article.viewCount} views
                  </small>
                </div>
                
                <div className="d-flex align-items-center">
                  <span className={`badge bg-primary me-2`}>
                    {article.status}
                  </span>
                  
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
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={articles.length}
            pageSize={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default ArticleList;
