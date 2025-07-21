import React, { useState, useRef } from 'react';
import api from '../services/api';

const DocumentUpload = ({ onContentLoaded, allowedTags = [] }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const supportedFormats = ['.docx', '.doc', '.odt', '.rtf'];

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const fileExtension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
    if (!supportedFormats.includes(fileExtension)) {
      setError(`Unsupported file format. Supported formats: ${supportedFormats.join(', ')}`);
      return;
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('document', file);
      
      // Add allowed tags if provided
      if (allowedTags.length > 0) {
        formData.append('allowedTags', allowedTags.join(','));
      }

      const response = await api.post('/document/convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const { html, metadata, images } = response.data.data;
        
        // Process HTML to ensure absolute image URLs
        let processedHtml = html;
        if (images && images.length > 0) {
          images.forEach(image => {
            // Replace relative URLs with absolute URLs
            const relativeUrl = image.url;
            const absoluteUrl = window.location.origin + relativeUrl;
            processedHtml = processedHtml.replace(
              new RegExp(`src="${relativeUrl}"`, 'g'),
              `src="${absoluteUrl}"`
            );
          });
        }
        
        // Call the callback with the converted content
        onContentLoaded(processedHtml);
        
        // Show success message
        setSuccess(`Document converted successfully! ${metadata.image_count} images extracted.`);
        
        // Log metadata for debugging
        console.log('Document conversion metadata:', metadata);
        if (images) {
          console.log('Extracted images:', images);
          console.log('Processed HTML sample:', processedHtml.substring(0, 500));
          
          // Log each image URL for debugging
          images.forEach((img, index) => {
            console.log(`Image ${index + 1}: ${window.location.origin}${img.url}`);
          });
          
          // Check if images are in the HTML
          const imgTags = processedHtml.match(/<img[^>]+>/g) || [];
          console.log(`Found ${imgTags.length} img tags in HTML`);
          if (imgTags.length > 0) {
            console.log('First img tag:', imgTags[0]);
          }
        }
      } else {
        throw new Error(response.data.message || 'Conversion failed');
      }
    } catch (err) {
      console.error('Document upload error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to convert document');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="document-upload">
      <div className="upload-section">
        <input
          ref={fileInputRef}
          type="file"
          accept={supportedFormats.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={uploading}
          className="upload-button"
        >
          {uploading ? 'Converting...' : 'Upload Document'}
        </button>
        
        <span className="supported-formats">
          Supported: Word (.docx, .doc), LibreOffice (.odt), RTF
        </span>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {uploading && (
        <div className="upload-progress">
          <div className="spinner"></div>
          <span>Converting document...</span>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;