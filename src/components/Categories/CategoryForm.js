import React from 'react';
import useForm from '../../hooks/useForm';
import InputField from '../Common/InputField';
import Button from '../Common/Button';
import Modal from '../Common/Modal';

const CategoryForm = ({ 
  category = null, 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false 
}) => {
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validate,
    reset
  } = useForm(
    {
      name: category?.name || '',
      description: category?.description || '',
      color: category?.color || '#6B46C1',
      isActive: category?.isActive !== undefined ? category.isActive : true
    },
    {
      name: [
        { required: true, message: 'Category name is required' },
        { minLength: 2, message: 'Name must be at least 2 characters' }
      ]
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      const success = await onSubmit(values);
      if (success) {
        reset();
        onClose();
      }
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const footer = (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={handleCancel}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="primary"
        form="category-form"
        loading={loading}
        icon="fas fa-save"
      >
        {category ? 'Update Category' : 'Create Category'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={category ? 'Edit Category' : 'Create Category'}
      footer={footer}
    >
      <form id="category-form" onSubmit={handleSubmit}>
        <InputField
          type="text"
          name="name"
          label="Category Name"
          value={values.name}
          placeholder="Enter category name"
          icon="fas fa-tag"
          error={errors.name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows="3"
            value={values.description}
            onChange={handleChange}
            placeholder="Enter category description (optional)"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="color" className="form-label">Color</label>
          <div className="d-flex align-items-center">
            <input
              type="color"
              id="color"
              name="color"
              className="form-control form-control-color me-3"
              value={values.color}
              onChange={handleChange}
              style={{ width: '60px', height: '40px' }}
            />
            <div>
              <div 
                className="badge"
                style={{ backgroundColor: values.color, color: 'white' }}
              >
                {values.name || 'Preview'}
              </div>
              <div className="form-text">
                This color will be used for category badges and themes
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              className="form-check-input"
              checked={values.isActive}
              onChange={(e) => handleChange({
                target: { name: 'isActive', value: e.target.checked }
              })}
            />
            <label className="form-check-label" htmlFor="isActive">
              Active Category
            </label>
            <div className="form-text">
              Inactive categories won't be shown to contributors when creating articles
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryForm;
