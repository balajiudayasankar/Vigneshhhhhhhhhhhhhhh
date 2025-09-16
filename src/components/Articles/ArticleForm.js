import React, { useState, useEffect } from 'react';
import { categoryApi } from '../../api/categoryApi';
import { contributorApi } from '../../api/contributorApi';
import { toastrService } from '../../services/toastrService';
import InputField from '../Common/InputField';
import Button from '../Common/Button';

const ArticleForm = ({ article = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    categoryId: '',
    tagIds: [],
    tags: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
    
    if (article) {
      setFormData({
        title: article.title || '',
        content: article.content || '',
        summary: article.summary || '',
        categoryId: article.categoryId || '',
        tagIds: article.tagIds || [],
        tags: article.tags ? article.tags.join(', ') : ''
      });
    }
  }, [article]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Process tags
    const tagArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const submitData = {
      ...formData,
      categoryId: parseInt(formData.categoryId),
      tags: tagArray,
      tagIds: [] // Will be handled by backend
    };

    try {
      if (onSubmit) {
        await onSubmit(submitData);
      }
    } catch (error) {
      toastrService.error('Failed to save article');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-12">
          <InputField
            type="text"
            name="title"
            label="Article Title"
            value={formData.title}
            placeholder="Enter article title"
            required
            error={errors.title}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="mb-3">
            <label htmlFor="summary" className="form-label">Summary</label>
            <textarea
              id="summary"
              name="summary"
              className="form-control"
              rows="3"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Brief summary of the article"
            />
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="categoryId" className="form-label">
              Category <span className="text-danger">*</span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <div className="invalid-feedback">{errors.categoryId}</div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="tags" className="form-label">Tags</label>
        <input
          type="text"
          id="tags"
          name="tags"
          className="form-control"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Enter tags separated by commas (e.g., react, javascript, tutorial)"
        />
        <div className="form-text">
          Separate multiple tags with commas. Tags help users find your content more easily.
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="content" className="form-label">
          Content <span className="text-danger">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          className={`form-control ${errors.content ? 'is-invalid' : ''}`}
          rows="12"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your article content here..."
          required
        />
        {errors.content && (
          <div className="invalid-feedback">{errors.content}</div>
        )}
      </div>

      <div className="d-flex justify-content-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon="fas fa-save"
        >
          {article ? 'Update Article' : 'Create Article'}
        </Button>
      </div>
    </form>
  );
};

export default ArticleForm;
