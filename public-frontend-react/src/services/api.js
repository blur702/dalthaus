// API configuration
const API_BASE_URL = 'http://localhost:5001/api/public';
const ADMIN_URL = 'http://localhost:5173';

// Check if user is logged in as admin
export const isAdminLoggedIn = () => {
  return localStorage.getItem('token') !== null || 
         sessionStorage.getItem('adminToken') !== null ||
         localStorage.getItem('adminPreviewMode') === 'true' ||
         window.location.search.includes('adminMode=true');
};

// Set admin token from URL parameter (for cross-domain auth)
export const checkAdminAuth = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const adminMode = urlParams.get('adminMode');
  
  if (adminMode === 'true') {
    localStorage.setItem('adminPreviewMode', 'true');
    console.log('Admin mode activated');
  } else if (adminMode === 'false') {
    localStorage.removeItem('adminPreviewMode');
    console.log('Admin mode deactivated');
  }
  
  const adminToken = urlParams.get('adminToken');
  if (adminToken) {
    sessionStorage.setItem('adminToken', adminToken);
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

// Generate edit link for content
export const getEditLink = (type, id) => {
  if (!isAdminLoggedIn()) return null;
  
  const managementPaths = {
    article: '/admin/content/articles',
    photobook: '/admin/content/photo-books',
    page: '/admin/content/pages'
  };
  
  const path = managementPaths[type];
  if (!path) return null;
  
  return `${ADMIN_URL}${path}`;
};

// Helper function to format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Helper function to extract first image from content
export const extractFirstImage = (content) => {
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : '/images/placeholder.svg';
};

// Helper function to strip HTML tags
export const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// Helper function to truncate text
export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength).trim() + '...';
};

// API methods
export const api = {
  // Fetch articles
  async getArticles(limit = 6) {
    try {
      const response = await fetch(`${API_BASE_URL}/articles?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch articles');
      return await response.json();
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  // Fetch single article by slug
  async getArticle(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${slug}`);
      if (!response.ok) throw new Error('Article not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  },

  // Fetch photo books
  async getPhotoBooks(limit = 12) {
    try {
      const response = await fetch(`${API_BASE_URL}/photobooks?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch photo books');
      return await response.json();
    } catch (error) {
      console.error('Error fetching photo books:', error);
      throw error;
    }
  },

  // Fetch single photo book by slug
  async getPhotoBook(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/photobooks/${slug}`);
      if (!response.ok) throw new Error('Photo book not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching photo book:', error);
      throw error;
    }
  },

  // Fetch pages
  async getPages() {
    try {
      const response = await fetch(`${API_BASE_URL}/pages`);
      if (!response.ok) throw new Error('Failed to fetch pages');
      return await response.json();
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  },

  // Fetch single page by slug
  async getPage(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${slug}`);
      if (!response.ok) throw new Error('Page not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching page:', error);
      throw error;
    }
  },
};

export default api;