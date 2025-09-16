import { formatters } from './formatters';

export const helpers = {
  // Generate random ID
  generateId: (length = 8) => {
    return Math.random().toString(36).substr(2, length);
  },

  // Generate UUID
  generateUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  // Deep clone object
  deepClone: (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => helpers.deepClone(item));
    if (typeof obj === 'object') {
      const copy = {};
      Object.keys(obj).forEach(key => {
        copy[key] = helpers.deepClone(obj[key]);
      });
      return copy;
    }
  },

  // Check if object is empty
  isEmpty: (obj) => {
    if (!obj) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return !obj;
  },

  // Remove empty values from object
  removeEmptyValues: (obj) => {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
        cleaned[key] = obj[key];
      }
    });
    return cleaned;
  },

  // Sort array of objects
  sortBy: (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = key.split('.').reduce((o, i) => o[i], a);
      const bVal = key.split('.').reduce((o, i) => o[i], b);
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  },

  // Group array by key
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = (key.includes('.') ? 
        key.split('.').reduce((o, i) => o[i], item) : 
        item[key]) || 'undefined';
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  // Debounce function
  debounce: (func, wait, immediate = false) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Copy text to clipboard
  copyToClipboard: async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
    return text;
  },

  // Get file icon class
  getFileIcon: (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const iconMap = {
      pdf: 'fas fa-file-pdf text-danger',
      doc: 'fas fa-file-word text-primary',
      docx: 'fas fa-file-word text-primary',
      xls: 'fas fa-file-excel text-success',
      xlsx: 'fas fa-file-excel text-success',
      ppt: 'fas fa-file-powerpoint text-warning',
      pptx: 'fas fa-file-powerpoint text-warning',
      txt: 'fas fa-file-alt text-secondary',
      jpg: 'fas fa-file-image text-info',
      jpeg: 'fas fa-file-image text-info',
      png: 'fas fa-file-image text-info',
      gif: 'fas fa-file-image text-info',
      zip: 'fas fa-file-archive text-warning',
      rar: 'fas fa-file-archive text-warning',
      mp4: 'fas fa-file-video text-primary',
      avi: 'fas fa-file-video text-primary',
      mp3: 'fas fa-file-audio text-success',
      wav: 'fas fa-file-audio text-success',
    };
    return iconMap[extension] || 'fas fa-file text-muted';
  },

  // Format bytes to human readable
  formatBytes: formatters.fileSize,

  // Get initials from name
  getInitials: (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  },

  // Generate avatar color based on name
  getAvatarColor: (name) => {
    if (!name) return '#6B46C1';
    
    const colors = [
      '#6B46C1', '#8B5CF6', '#10B981', '#EF4444', 
      '#F59E0B', '#3B82F6', '#EC4899', '#14B8A6'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  },

  // Scroll to element
  scrollToElement: (elementId, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  },

  // Check if element is in viewport
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Format search query for highlighting
  highlightSearchTerm: (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },

  // Validate URL
  isValidUrl: (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },

  // Get query parameters from URL
  getQueryParams: () => {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    
    return params;
  },

  // Set query parameters in URL
  setQueryParams: (params) => {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.set(key, params[key]);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.pushState({}, '', url);
  },

  // Local storage helpers
  storage: {
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    
    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
      }
    },
    
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
  }
};

export default helpers;
