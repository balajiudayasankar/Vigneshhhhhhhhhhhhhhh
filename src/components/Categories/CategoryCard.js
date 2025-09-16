import React from 'react';

const CategoryCard = ({ 
  category, 
  onClick = null, 
  showActions = false, 
  onEdit = null, 
  onDelete = null 
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  return (
    <div 
      className={`card border-0 h-100 ${onClick ? 'cursor-pointer card-hover' : ''}`}
      style={{ backgroundColor: `${category.color}20` }}
      onClick={handleCardClick}
    >
      <div className="card-body text-center">
        <div 
          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style={{ 
            width: '60px', 
            height: '60px', 
            backgroundColor: category.color 
          }}
        >
          <i className="fas fa-folder text-white fa-lg"></i>
        </div>
        
        <h5 className="card-title mb-2">{category.name}</h5>
        
        {category.description && (
          <p className="card-text text-muted small mb-3">
            {category.description}
          </p>
        )}
        
        <div className="d-flex justify-content-center align-items-center mb-2">
          <span className="badge bg-light text-dark">
            <i className="fas fa-file-alt me-1"></i>
            {category.articleCount || 0} articles
          </span>
        </div>

        {showActions && (
          <div className="btn-group mt-2">
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(category);
              }}
              title="Edit Category"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(category);
              }}
              title="Delete Category"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        )}
      </div>
      
      {category.isActive === false && (
        <div className="card-footer bg-warning text-dark text-center py-1">
          <small><i className="fas fa-exclamation-triangle me-1"></i>Inactive</small>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
