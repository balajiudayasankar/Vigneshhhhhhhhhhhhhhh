import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  trend = null, 
  onClick = null 
}) => {
  const cardClasses = `card bg-${color} text-white ${onClick ? 'cursor-pointer' : ''}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="card-title mb-0">{value}</h3>
            <p className="card-text mb-0">{title}</p>
            {trend && (
              <small className="d-block mt-1">
                <i className={`fas fa-arrow-${trend.direction} me-1`}></i>
                {trend.value}% {trend.direction === 'up' ? 'increase' : 'decrease'}
              </small>
            )}
          </div>
          <div className="align-self-center">
            <i className={`${icon} fa-2x`}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
