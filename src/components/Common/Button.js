import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  type = 'button',
  disabled = false,
  loading = false,
  icon = null,
  className = '',
  onClick,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  const buttonClass = `btn btn-${variant} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
          Loading...
        </>
      ) : (
        <>
          {icon && <i className={`${icon} me-2`}></i>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
