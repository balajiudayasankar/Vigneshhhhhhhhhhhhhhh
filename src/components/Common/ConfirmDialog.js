import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' 
}) => {
  const typeConfig = {
    danger: { class: 'btn-danger', icon: 'fas fa-exclamation-triangle' },
    warning: { class: 'btn-warning', icon: 'fas fa-exclamation-circle' },
    info: { class: 'btn-info', icon: 'fas fa-info-circle' },
    success: { class: 'btn-success', icon: 'fas fa-check-circle' }
  };

  const config = typeConfig[type] || typeConfig.danger;

  const footer = (
    <>
      <button 
        type="button" 
        className="btn btn-secondary"
        onClick={onCancel}
      >
        {cancelText}
      </button>
      <button 
        type="button" 
        className={`btn ${config.class} ms-2`}
        onClick={onConfirm}
      >
        {confirmText}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={footer}
    >
      <div className="text-center">
        <i className={`${config.icon} fa-3x text-${type} mb-3`}></i>
        <p>{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
