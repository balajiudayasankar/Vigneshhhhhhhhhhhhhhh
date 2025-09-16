import { uploadApi } from '../api/uploadApi';
import { toastrService } from './toastrService';

export const uploadService = {
  // Upload a single file
  uploadFile: async (file, type = 'document') => {
    try {
      // Validate file
      const validation = uploadService.validateFile(file);
      if (!validation.valid) {
        toastrService.error(validation.message);
        return { success: false, message: validation.message };
      }

      const response = await uploadApi.uploadFile(file, type);
      
      if (response.success) {
        toastrService.success('File uploaded successfully');
        return response;
      } else {
        toastrService.error(response.message || 'Upload failed');
        return response;
      }
    } catch (error) {
      const errorMessage = error.message || 'Upload failed';
      toastrService.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  },

  // Upload proof document for contributor request
  uploadProofDocument: async (file) => {
    try {
      const validation = uploadService.validateFile(file);
      if (!validation.valid) {
        toastrService.error(validation.message);
        return { success: false, message: validation.message };
      }

      const response = await uploadApi.uploadProofDocument(file);
      
      if (response.success) {
        toastrService.success('Proof document uploaded successfully');
        return response;
      } else {
        toastrService.error(response.message || 'Upload failed');
        return response;
      }
    } catch (error) {
      const errorMessage = error.message || 'Upload failed';
      toastrService.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  },

  // Upload document for article
  uploadArticleDocument: async (articleId, file) => {
    try {
      const validation = uploadService.validateFile(file);
      if (!validation.valid) {
        toastrService.error(validation.message);
        return { success: false, message: validation.message };
      }

      const response = await uploadApi.uploadArticleDocument(articleId, file);
      
      if (response.success) {
        toastrService.success('Document attached to article successfully');
        return response;
      } else {
        toastrService.error(response.message || 'Upload failed');
        return response;
      }
    } catch (error) {
      const errorMessage = error.message || 'Upload failed';
      toastrService.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  },

  // Upload multiple files
  uploadMultipleFiles: async (files, type = 'document') => {
    const results = [];
    
    for (const file of files) {
      const result = await uploadService.uploadFile(file, type);
      results.push(result);
    }
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    if (successful.length > 0) {
      toastrService.success(`${successful.length} file(s) uploaded successfully`);
    }
    
    if (failed.length > 0) {
      toastrService.warning(`${failed.length} file(s) failed to upload`);
    }
    
    return {
      success: successful.length > 0,
      successful,
      failed,
      total: results.length
    };
  },

  // Delete uploaded file
  deleteFile: async (fileId) => {
    try {
      const response = await uploadApi.deleteFile(fileId);
      
      if (response.success) {
        toastrService.success('File deleted successfully');
        return response;
      } else {
        toastrService.error(response.message || 'Delete failed');
        return response;
      }
    } catch (error) {
      const errorMessage = error.message || 'Delete failed';
      toastrService.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  },

  // Validate file before upload
  validateFile: (file) => {
    const maxSizeInMB = 10; // 10MB limit
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ];

    // Check file size
    if (file.size > maxSizeInBytes) {
      return {
        valid: false,
        message: `File size exceeds ${maxSizeInMB}MB limit`
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: 'File type not supported. Please upload PDF, DOC, DOCX, TXT, PNG, JPG, or JPEG files.'
      };
    }

    // Check file name
    if (!file.name || file.name.trim() === '') {
      return {
        valid: false,
        message: 'File must have a valid name'
      };
    }

    return { valid: true };
  },

  // Get file extension
  getFileExtension: (filename) => {
    return filename.split('.').pop().toLowerCase();
  },

  // Get file icon based on type
  getFileIcon: (file) => {
    const extension = uploadService.getFileExtension(file.name);
    
    switch (extension) {
      case 'pdf':
        return 'fas fa-file-pdf text-danger';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word text-primary';
      case 'txt':
        return 'fas fa-file-alt text-secondary';
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'fas fa-file-image text-success';
      default:
        return 'fas fa-file text-muted';
    }
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Create file preview
  createFilePreview: (file) => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  }
};
