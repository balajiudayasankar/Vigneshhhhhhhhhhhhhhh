import React from 'react';

const RatingComponent = ({ 
  rating = 0, 
  onRatingChange = null, 
  interactive = false, 
  size = 'md',
  showText = false,
  className = '' 
}) => {
  const sizes = {
    sm: 'fa-sm',
    md: '',
    lg: 'fa-lg',
    xl: 'fa-2x'
  };

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (e, starRating) => {
    if (!interactive) return;
    
    const stars = e.currentTarget.parentElement.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
      if (index < starRating) {
        star.classList.add('text-warning');
        star.classList.remove('text-muted');
      } else {
        star.classList.add('text-muted');
        star.classList.remove('text-warning');
      }
    });
  };

  const handleMouseLeave = (e) => {
    if (!interactive) return;
    
    const stars = e.currentTarget.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('text-warning');
        star.classList.remove('text-muted');
      } else {
        star.classList.add('text-muted');
        star.classList.remove('text-warning');
      }
    });
  };

  const getRatingText = (rating) => {
    const texts = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return texts[rating] || 'Not Rated';
  };

  return (
    <div 
      className={`rating-component d-flex align-items-center ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`
              fas fa-star rating-star ${sizes[size]} 
              ${interactive ? 'cursor-pointer' : ''} 
              ${star <= rating ? 'text-warning' : 'text-muted'}
            `}
            onClick={() => handleStarClick(star)}
            onMouseEnter={(e) => handleStarHover(e, star)}
            title={interactive ? `Rate ${star} star${star !== 1 ? 's' : ''}` : ''}
          />
        ))}
      </div>
      
      {showText && (
        <span className="ms-2 text-muted">
          {rating > 0 ? (
            <>
              {rating}.0 - {getRatingText(rating)}
            </>
          ) : (
            'No rating'
          )}
        </span>
      )}
      
      {interactive && (
        <small className="ms-2 text-muted">
          Click to rate
        </small>
      )}
    </div>
  );
};

export default RatingComponent;
