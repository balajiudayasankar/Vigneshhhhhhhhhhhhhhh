import React from 'react';
import ArticleCard from '../Articles/ArticleCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import { helpers } from '../../utils/helpers';

const SearchResults = ({ 
  results = [], 
  loading = false, 
  searchTerm = '',
  totalResults = 0,
  searchTime = 0 
}) => {
  const highlightSearchTerm = (text, term) => {
    if (!term || !text) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  if (loading) {
    return <LoadingSpinner text="Searching..." />;
  }

  return (
    <div>
      {/* Search Info */}
      {searchTerm && (
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">
              Search Results for "{searchTerm}"
            </h5>
            <small className="text-muted">
              {searchTime > 0 && `Search completed in ${searchTime}ms`}
            </small>
          </div>
          
          <p className="text-muted mb-0">
            {totalResults === 0 ? 'No results found' : 
             totalResults === 1 ? '1 result found' : 
             `${totalResults} results found`}
          </p>
        </div>
      )}

      {/* No Results */}
      {results.length === 0 && searchTerm && (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h4>No Results Found</h4>
            <p className="text-muted mb-4">
              We couldn't find any articles matching "<strong>{searchTerm}</strong>"
            </p>
            
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <div className="alert alert-light">
                  <h6>Search Tips:</h6>
                  <ul className="mb-0 text-start">
                    <li>Check your spelling</li>
                    <li>Try different keywords</li>
                    <li>Use more general terms</li>
                    <li>Remove filters to broaden your search</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="row">
          {results.map((article, index) => (
            <div key={article.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary">
                      {article.categoryName}
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
                      dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(article.title, searchTerm)
                      }}
                    />
                  </h5>
                  
                  <p 
                    className="card-text text-muted"
                    dangerouslySetInnerHTML={{
                      __html: highlightSearchTerm(
                        helpers.formatters?.truncate(article.summary || '', 120) || article.summary, 
                        searchTerm
                      )
                    }}
                  />
                  
                  <div className="mb-2">
                    <small className="text-muted">
                      <i className="fas fa-user me-1"></i>
                      <span dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(article.contributorName, searchTerm)
                      }} />
                    </small>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-muted">
                      <i className="fas fa-calendar me-1"></i>
                      {new Date(article.createdDate).toLocaleDateString()}
                    </small>
                  </div>
                  
                  {/* Match Score */}
                  {article.matchScore && (
                    <div className="mb-2">
                      <small className="text-muted">
                        <i className="fas fa-chart-bar me-1"></i>
                        {Math.round(article.matchScore * 100)}% match
                      </small>
                    </div>
                  )}
                  
                  {/* Tags with highlighting */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="mb-3">
                      {article.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} className="badge bg-light text-dark me-1">
                          <span dangerouslySetInnerHTML={{
                            __html: highlightSearchTerm(`#${tag}`, searchTerm)
                          }} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="card-footer bg-transparent">
                  <a 
                    href={`/articles/${article.id}`}
                    className="btn btn-primary btn-sm w-100"
                  >
                    <i className="fas fa-book-open me-1"></i>
                    Read Article
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Suggestions */}
      {results.length === 0 && !loading && (
        <div className="card mt-4">
          <div className="card-body">
            <h6>Popular Articles</h6>
            <p className="text-muted">Since we couldn't find what you're looking for, here are some popular articles:</p>
            <div className="d-flex flex-wrap gap-2">
              <a href="/search?q=tutorial" className="btn btn-outline-primary btn-sm">Tutorial</a>
              <a href="/search?q=guide" className="btn btn-outline-primary btn-sm">Guide</a>
              <a href="/search?q=howto" className="btn btn-outline-primary btn-sm">How-to</a>
              <a href="/search?q=best practices" className="btn btn-outline-primary btn-sm">Best Practices</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
