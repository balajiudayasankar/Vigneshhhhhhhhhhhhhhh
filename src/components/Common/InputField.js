import React from 'react';

const InputField = ({ 
  type = 'text',
  name,
  label,
  value,
  placeholder,
  required = false,
  disabled = false,
  error,
  icon,
  className = '',
  onChange,
  onBlur,
  ...props 
}) => {
  const inputId = `input-${name}`;
  const hasError = error && error.length > 0;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      
      <div className="position-relative">
        {icon && (
          <span className="position-absolute top-50 start-0 translate-middle-y ps-3">
            <i className={icon}></i>
          </span>
        )}
        
        <input
          type={type}
          id={inputId}
          name={name}
          className={`form-control ${icon ? 'ps-5' : ''} ${hasError ? 'is-invalid' : ''}`}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          {...props}
        />
        
        {hasError && (
          <div className="invalid-feedback">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
