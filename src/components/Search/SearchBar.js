import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';

const SearchBar = ({ 
  placeholder = 'Search articles, topics, keywords...', 
  onSearch, 
  initialValue = '', 
  debounceDelay = 500 
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="input-group">
        <span className="input-group-text">
          <i className="fas fa-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleClear}
            title="Clear search"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
        <button 
          type="submit" 
          className="btn btn-primary"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
