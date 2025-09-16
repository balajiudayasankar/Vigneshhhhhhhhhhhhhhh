import React, { useState } from 'react';
import CategoryCard from './CategoryCard';
import LoadingSpinner from '../Common/LoadingSpinner';

const CategoryList = ({ 
  categories = [], 
  loading = false,
  onCategoryClick = null,
  showActions = false,
  onEdit = null,
  onDelete = null 
}) => {
  const [sortBy, setSortBy] = useState('name');
  const [filterActive, setFilterActive] = useState('all');

  const filteredCategories = categories
    .filter(category => {
      if (filterActive === 'active') return category.isActive !== false;
      if (filterActive === 'inactive') return category.isActive === false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'articles':
          return (b.articleCount || 0) - (a.articleCount || 0);
        case 'created':
          return new Date(b.createdDate) - new Date(a.createdDate);
        default:
          return 0;
      }
    });

  if (loading) {
    return <LoadingSpinner text="Loading categories..." />;
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
        <h4>No Categories Found</h4>
        <p className="text-muted">
          No categories have been created yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <label htmlFor="sortBy" className="form-label me-2 mb-0">Sort by:</label>
            <select 
              id="sortBy"
              className="form-select form-select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="name">Name</option>
              <option value="articles">Article Count</option>
              <option value="created">Created Date</option>
            </select>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="d-flex align-items-center justify-content-md-end">
            <label htmlFor="filterActive" className="form-label me-2 mb-0">Filter:</label>
            <select 
              id="filterActive"
              className="form-select form-select-sm"
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">All Categories</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-3">
        <p className="text-muted mb-0">
          Showing {filteredCategories.length} of {categories.length} categories
        </p>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-4">
          <i className="fas fa-filter fa-2x text-muted mb-3"></i>
          <h5>No categories match your filters</h5>
          <p className="text-muted">Try adjusting your filter options.</p>
        </div>
      ) : (
        <div className="row">
          {filteredCategories.map((category) => (
            <div key={category.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <CategoryCard
                category={category}
                onClick={onCategoryClick}
                showActions={showActions}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
