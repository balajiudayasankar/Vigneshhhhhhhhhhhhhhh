import React, { createContext, useContext, useState, useEffect } from 'react';
import { articleApi } from '../api/articleApi';
import { categoryApi } from '../api/categoryApi';
import { toastrService } from '../services/toastrService';

const ArticleContext = createContext();

export const useArticle = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticle must be used within an ArticleProvider');
  }
  return context;
};

export const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    tag: '',
    status: '',
    sortBy: 'recent'
  });

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadPublishedArticles();
  }, []);

  const loadPublishedArticles = async () => {
    try {
      setLoading(true);
      const response = await articleApi.getPublishedArticles();
      if (response.success) {
        setArticles(response.data || []);
      }
    } catch (error) {
      toastrService.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAllCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const getArticleById = async (articleId) => {
    try {
      setLoading(true);
      const response = await articleApi.getArticleById(articleId);
      if (response.success) {
        setCurrentArticle(response.data);
        // Increment view count
        await articleApi.incrementViewCount(articleId);
        return response.data;
      }
    } catch (error) {
      toastrService.error('Failed to load article');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchArticles = async (searchTerm) => {
    try {
      setLoading(true);
      const response = await articleApi.searchArticles(searchTerm);
      if (response.success) {
        setSearchResults(response.data || []);
        return response.data;
      }
    } catch (error) {
      toastrService.error('Search failed');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getMostViewedArticles = async (count = 10) => {
    try {
      const response = await articleApi.getMostViewedArticles(count);
      if (response.success) {
        return response.data || [];
      }
    } catch (error) {
      console.error('Failed to load most viewed articles');
      return [];
    }
  };

  const getRecentArticles = async (count = 10) => {
    try {
      const response = await articleApi.getRecentArticles(count);
      if (response.success) {
        return response.data || [];
      }
    } catch (error) {
      console.error('Failed to load recent articles');
      return [];
    }
  };

  const filterArticles = (articles) => {
    let filtered = [...articles];

    if (filters.category) {
      filtered = filtered.filter(article => article.categoryName === filters.category);
    }

    if (filters.tag) {
      filtered = filtered.filter(article => 
        article.tags && article.tags.includes(filters.tag)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(article => article.status === filters.status);
    }

    // Sort articles
    switch (filters.sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        break;
      case 'popular':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  };

  const clearCurrentArticle = () => {
    setCurrentArticle(null);
  };

  const value = {
    articles,
    categories,
    tags,
    currentArticle,
    loading,
    searchResults,
    filters,
    setFilters,
    loadPublishedArticles,
    getArticleById,
    searchArticles,
    getMostViewedArticles,
    getRecentArticles,
    filterArticles,
    clearCurrentArticle
  };

  return (
    <ArticleContext.Provider value={value}>
      {children}
    </ArticleContext.Provider>
  );
};
