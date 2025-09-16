import React from 'react';

const SearchFilters = ({ 
  filters, 
  onFiltersChange, 
  categories = [], 
  tags = [],
  contributors = [] 
}) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      category: '',
      contributor: '',
      dateRange: '',
      sortBy: 'relevance',
      rating: '',
      tag: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== '' && value !== 'relevance'
  );

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <i className="fas fa-filter me-2"></i>
            Search Filters
          </h6>
          {hasActiveFilters && (
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={handleClearFilters}
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      
      <div className="card-body">
        {/* Category Filter */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select form-select-sm"
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="mb-3">
          <label className="form-label">Sort By</label>
          <select
            className="form-select form-select-sm"
            value={filters.sortBy || 'relevance'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="mb-3">
          <label className="form-label">Date Range</label>
          <select
            className="form-select form-select-sm"
            value={filters.dateRange || ''}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            <option value="">Any Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div className="mb-3">
          <label className="form-label">Minimum Rating</label>
          <select
            className="form-select form-select-sm"
            value={filters.rating || ''}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>
        </div>

        {/* Contributor Filter */}
        {contributors.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Author</label>
            <select
              className="form-select form-select-sm"
              value={filters.contributor || ''}
              onChange={(e) => handleFilterChange('contributor', e.target.value)}
            >
              <option value="">Any Author</option>
              {contributors.map(contributor => (
                <option key={contributor.id} value={contributor.name}>
                  {contributor.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tags Filter */}
        {tags.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Tags</label>
            <select
              className="form-select form-select-sm"
              value={filters.tag || ''}
              onChange={(e) => handleFilterChange('tag', e.target.value)}
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.name}>
                  #{tag.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-top">
            <small className="text-muted d-block mb-2">Active Filters:</small>
            <div className="d-flex flex-wrap gap-1">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === '' || value === 'relevance') return null;
                
                return (
                  <span key={key} className="badge bg-primary">
                    {key}: {value}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-1"
                      style={{ fontSize: '0.6em' }}
                      onClick={() => handleFilterChange(key, '')}
                    ></button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
