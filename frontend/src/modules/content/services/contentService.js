import api from '../../../services/api';

class ContentService {
  constructor(contentType, endpoint) {
    this.contentType = contentType;
    this.endpoint = `/content/${endpoint}`;
  }

  // Get all content items
  async getAll(params = {}) {
    try {
      const response = await api.get(this.endpoint, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get single content by ID
  async getById(id) {
    try {
      const response = await api.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get content by slug
  async getBySlug(slug) {
    try {
      const response = await api.get(`${this.endpoint}/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new content
  async create(data) {
    try {
      const response = await api.post(this.endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update content
  async update(id, data) {
    try {
      const response = await api.put(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete content
  async delete(id) {
    try {
      const response = await api.delete(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data.error || 'An error occurred',
        status: error.response.status
      };
    } else if (error.request) {
      return {
        message: 'No response from server',
        status: 0
      };
    } else {
      return {
        message: error.message || 'An error occurred',
        status: 0
      };
    }
  }
}

// Create specific service instances
export const photoBookService = new ContentService('photoBook', 'photo-books');
export const articleService = new ContentService('article', 'articles');
export const pageService = new ContentService('page', 'pages');

// Additional methods for specific content types
articleService.getByCategory = async function(category, params = {}) {
  try {
    const response = await api.get(`${this.endpoint}/category/${category}`, { params });
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
};

pageService.getMenuPages = async function() {
  try {
    const response = await api.get(`${this.endpoint}/menu`);
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
};

pageService.getHierarchy = async function() {
  try {
    const response = await api.get(`${this.endpoint}/hierarchy`);
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
};

export default ContentService;