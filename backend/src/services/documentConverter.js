const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class DocumentConverterService {
  constructor() {
    this.baseURL = process.env.DOC_CONVERTER_URL || 'http://127.0.0.1:8001';
  }

  /**
   * Convert document to HTML
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} filename - Original filename
   * @param {Array} allowedTags - List of allowed HTML tags from TinyMCE
   * @returns {Object} Conversion result with HTML and images
   */
  async convertDocument(fileBuffer, filename, allowedTags = null) {
    try {
      const form = new FormData();
      
      // Add file
      form.append('file', fileBuffer, {
        filename: filename,
        contentType: this.getMimeType(filename)
      });
      
      // Add allowed tags if provided
      if (allowedTags && Array.isArray(allowedTags)) {
        form.append('allowed_tags', allowedTags.join(','));
      }
      
      // Add extract images flag
      form.append('extract_images', 'true');
      
      // Make request to Python service
      const response = await axios.post(`${this.baseURL}/convert`, form, {
        headers: {
          ...form.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      
      return response.data;
    } catch (error) {
      console.error('Document conversion error:', error.message);
      
      if (error.response) {
        throw new Error(error.response.data.detail || 'Document conversion failed');
      }
      
      throw new Error('Document conversion service unavailable');
    }
  }

  /**
   * Check if document conversion service is healthy
   * @returns {boolean} Service health status
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseURL}/`);
      return response.data.status === 'healthy';
    } catch (error) {
      return false;
    }
  }

  /**
   * Get supported document formats
   * @returns {Array} List of supported formats
   */
  async getSupportedFormats() {
    try {
      const response = await axios.get(`${this.baseURL}/supported-formats`);
      return response.data.formats;
    } catch (error) {
      console.error('Error fetching supported formats:', error);
      return [];
    }
  }

  /**
   * Get MIME type from filename
   * @param {string} filename - File name
   * @returns {string} MIME type
   */
  getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.doc': 'application/msword',
      '.odt': 'application/vnd.oasis.opendocument.text',
      '.rtf': 'application/rtf'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * Validate file format
   * @param {string} filename - File name
   * @returns {boolean} True if format is supported
   */
  isFormatSupported(filename) {
    const ext = path.extname(filename).toLowerCase();
    return ['.docx', '.doc', '.odt', '.rtf'].includes(ext);
  }
}

module.exports = new DocumentConverterService();