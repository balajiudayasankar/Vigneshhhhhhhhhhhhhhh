import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', centered = true }) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  const content = (
    <>
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="mt-2 mb-0">{text}</p>}
    </>
  );

  if (centered) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
