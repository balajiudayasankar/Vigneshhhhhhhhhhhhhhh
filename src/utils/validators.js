export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password) => {
    return password && password.length >= 6;
  },

  required: (value) => {
    return value && value.toString().trim() !== '';
  },

  minLength: (value, length) => {
    return value && value.length >= length;
  },

  maxLength: (value, length) => {
    return !value || value.length <= length;
  },

  url: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  phone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
  },

  alphanumeric: (value) => {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(value);
  },

  numeric: (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  }
};

export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = data[field];

    fieldRules.forEach(rule => {
      if (typeof rule === 'string') {
        if (rule === 'required' && !validators.required(value)) {
          errors[field] = `${field} is required`;
        }
      } else if (typeof rule === 'object') {
        const { type, message, ...params } = rule;
        
        if (type === 'required' && !validators.required(value)) {
          errors[field] = message || `${field} is required`;
        } else if (type === 'email' && value && !validators.email(value)) {
          errors[field] = message || 'Invalid email format';
        } else if (type === 'minLength' && value && !validators.minLength(value, params.length)) {
          errors[field] = message || `${field} must be at least ${params.length} characters`;
        } else if (type === 'maxLength' && value && !validators.maxLength(value, params.length)) {
          errors[field] = message || `${field} must not exceed ${params.length} characters`;
        }
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
