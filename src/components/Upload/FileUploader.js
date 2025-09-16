import React, { useState, useRef } from 'react';
import { uploadService } from '../../services/uploadService';
import { toastrService } from '../../services/toastrService';
import { helpers } from '../../utils/helpers';

const FileUploader = ({ 
  onUploadSuccess, 
  onUploadError,
  acceptedTypes = 'image/*,.pdf,.doc,.docx',
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const results = [];
      
      for (const file of Array.from(files)) {
        const validation = uploadService.validateFile(file);
        if (!validation.valid) {
          toastrService.error(validation.message);
          continue;
        }

        const result = await uploadService.uploadFile(file);
        if (result.success) {
          results.push(result.data);
        }
      }

      if (results.length > 0) {
        onUploadSuccess && onUploadSuccess(multiple ? results : results[0]);
      }
      
    } catch (error) {
      const errorMessage = error.message || 'Upload failed';
      toastrService.error(errorMessage);
      onUploadError && onUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className={`file-uploader ${className}`}>
      <div
        className={`border-2 border-dashed rounded p-4 text-center ${
          dragOver ? 'border-primary bg-light' : 'border-muted'
        } ${uploading ? 'opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="d-none"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        
        {uploading ? (
          <div>
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Uploading...</span>
            </div>
            <p className="mb-0">Uploading files...</p>
          </div>
        ) : (
          <div>
            <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
            <h6>Drop files here or click to browse</h6>
            <p className="text-muted mb-3">
              Supported formats: PDF, DOC, DOCX, Images
              <br />
              Maximum size: {helpers.formatBytes(maxSize)}
            </p>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="fas fa-folder-open me-1"></i>
              Choose Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
