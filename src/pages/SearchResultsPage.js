import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { articleApi } from '../api/articleApi';
import { categoryApi } from '../api/categoryApi';
import { toastrService } from '../services/toastrService';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadCategories();
    if (searchParams.get('q')) {
      performSearch(searchParams.get('q'));
    }
  }, []);

  const loadCategories = async () => {
    try {
      const result = await categoryApi.getAllCategories();
      setCategories(result.data || []);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const performSearch = async (term) => {
    if (!term.trim()) {
      setArticles([]);
      return;
    }

    setLoading(true);
    try {
      const result = await articleApi.searchArticles(term);
      setArticles(result.data || []);
    } catch (error) {
      toastrService.error('Search failed. Please try again.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
    performSearch(searchTerm);
  };

  const filteredArticles = selectedCategory
    ? articles.filter(article => article.categoryName === selectedCategory)
    : articles;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">
            <i className="fas fa-search me-2 text-primary"></i>
            Search Knowledge Base
          </h2>
        </div>
      </div>

      {/* Search Form */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="row">
                  <div className="col-md-8">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search articles, topics, keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn btn-primary" type="submit">
                        Search
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="row">
        <div className="col-12">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Searching...</span>
              </div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : (
            <>
              {searchParams.get('q') && (
                <div className="mb-3">
                  <p className="text-muted">
                    {filteredArticles.length} result(s) found for "<strong>{searchParams.get('q')}</strong>"
                    {selectedCategory && ` in category "${selectedCategory}"`}
                  </p>
                </div>
              )}

              {filteredArticles.length === 0 && searchParams.get('q') ? (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>No articles found</h4>
                    <p className="text-muted">
                      Try adjusting your search terms or browse different categories.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="row">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="col-md-6 col-lg-4 mb-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span 
                              className="badge rounded-pill"
                              style={{ backgroundColor: '#6B46C1' }}
                            >
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Popular Categories */}
      {!searchParams.get('q') && (
        <div className="row mt-5">
          <div className="col-12">
            <h4 className="mb-3">Browse by Category</h4>
            <div className="row">
              {categories.map((category) => (
                <div key={category.id} className="col-md-3 mb-3">
                  <div 
                    className="card border-0 cursor-pointer"
                    style={{ backgroundColor: `${category.color}20` }}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setSearchTerm('');
                      setSearchParams({});
                    }}
                  >
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
                      <small className="text-muted">{category.articleCount || 0} articles</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;