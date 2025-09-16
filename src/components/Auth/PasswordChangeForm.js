import React from 'react';
import useForm from '../../hooks/useForm';
import InputField from '../Common/InputField';
import Button from '../Common/Button';
import Modal from '../Common/Modal';

const PasswordChangeForm = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validate,
    reset
  } = useForm(
    {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    {
      currentPassword: [
        { required: true, message: 'Current password is required' }
      ],
      newPassword: [
        { required: true, message: 'New password is required' },
        { minLength: 6, message: 'Password must be at least 6 characters' }
      ],
      confirmPassword: [
        { required: true, message: 'Please confirm your new password' },
        { 
          custom: (value, allValues) => {
            return value !== allValues.newPassword ? 'Passwords do not match' : null;
          }
        }
      ]
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      const { confirmPassword, ...submitData } = values;
      const success = await onSubmit(submitData);
      
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
        form="password-change-form"
        loading={loading}
        icon="fas fa-key"
      >
        Change Password
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Change Password"
      footer={footer}
    >
      <form id="password-change-form" onSubmit={handleSubmit}>
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          <strong>Password Requirements:</strong>
          <ul className="mb-0 mt-2">
            <li>At least 6 characters long</li>
            <li>Should be different from your current password</li>
          </ul>
        </div>

        <InputField
          type="password"
          name="currentPassword"
          label="Current Password"
          value={values.currentPassword}
          placeholder="Enter current password"
          icon="fas fa-lock"
          error={errors.currentPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        
        <InputField
          type="password"
          name="newPassword"
          label="New Password"
          value={values.newPassword}
          placeholder="Enter new password"
          icon="fas fa-key"
          error={errors.newPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        
        <InputField
          type="password"
          name="confirmPassword"
          label="Confirm New Password"
          value={values.confirmPassword}
          placeholder="Confirm new password"
          icon="fas fa-key"
          error={errors.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
      </form>
    </Modal>
  );
};

export default PasswordChangeForm;
