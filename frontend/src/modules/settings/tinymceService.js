import api from '../../services/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  // Axios automatically throws for non-2xx status codes
  // and returns the data directly, not a Response object
  return response.data;
};

// Profile Management
export const profileService = {
  // Get all profiles
  async getAll() {
    try {
      const response = await api.get('/tinymce/profiles');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profiles');
    }
  },

  // Get specific profile
  async getById(id) {
    try {
      const response = await api.get(`/tinymce/profiles/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile');
    }
  },

  // Create new profile
  async create(profileData) {
    try {
      const response = await api.post('/tinymce/profiles', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create profile');
    }
  },

  // Update profile
  async update(id, profileData) {
    try {
      const response = await api.put(`/tinymce/profiles/${id}`, profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  },

  // Delete profile
  async delete(id) {
    try {
      const response = await api.delete(`/tinymce/profiles/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete profile');
    }
  },

  // Duplicate profile
  async duplicate(id, name) {
    try {
      const response = await api.post(`/tinymce/profiles/${id}/duplicate`, { name });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to duplicate profile');
    }
  },

  // Get compiled configuration
  async getConfig(id) {
    try {
      const response = await api.get(`/tinymce/profiles/${id}/config`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch configuration');
    }
  }
};

// Toolbar Presets
export const toolbarPresetService = {
  // Get all toolbar presets
  async getAll() {
    try {
      const response = await api.get('/tinymce/toolbar-presets');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch toolbar presets');
    }
  }
};

// Allowed Tags Management
export const allowedTagsService = {
  // Get allowed tags for a profile
  async getByProfileId(profileId) {
    try {
      const response = await api.get(`/tinymce/profiles/${profileId}/allowed-tags`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch allowed tags');
    }
  },

  // Update allowed tags for a profile
  async update(profileId, tags) {
    try {
      const response = await api.put(`/tinymce/profiles/${profileId}/allowed-tags`, { tags });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update allowed tags');
    }
  }
};

// Feature Flags Management
export const featureFlagsService = {
  // Get feature flags for a profile
  async getByProfileId(profileId) {
    try {
      const response = await api.get(`/tinymce/profiles/${profileId}/features`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch feature flags');
    }
  },

  // Update feature flags for a profile
  async update(profileId, features) {
    try {
      const response = await api.put(`/tinymce/profiles/${profileId}/features`, { features });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update feature flags');
    }
  }
};

// Default feature configurations
export const DEFAULT_FEATURES = [
  {
    feature_name: 'pagebreak',
    enabled: true,
    config: {},
    required: true, // Cannot be disabled
    description: 'Page break functionality'
  },
  {
    feature_name: 'spellcheck',
    enabled: true,
    config: {},
    description: 'Spell checking'
  },
  {
    feature_name: 'autosave',
    enabled: false,
    config: {
      interval: 30,
      retention: 10
    },
    description: 'Auto-save functionality'
  },
  {
    feature_name: 'wordcount',
    enabled: true,
    config: {
      countSpaces: false,
      countHTML: false
    },
    description: 'Word and character counting'
  },
  {
    feature_name: 'accessibility',
    enabled: false,
    config: {},
    description: 'Accessibility checker'
  },
  {
    feature_name: 'templates',
    enabled: false,
    config: {},
    description: 'Content templates'
  },
  {
    feature_name: 'quickbars',
    enabled: false,
    config: {},
    description: 'Context-sensitive toolbars'
  },
  {
    feature_name: 'emoticons',
    enabled: false,
    config: {},
    description: 'Emoji support'
  }
];

// Common HTML tag presets
export const TAG_PRESETS = {
  basic: [
    { tag_name: 'p', attributes: {} },
    { tag_name: 'br', attributes: {}, is_void: true },
    { tag_name: 'strong', attributes: {} },
    { tag_name: 'em', attributes: {} },
    { tag_name: 'u', attributes: {} },
    { tag_name: 'strike', attributes: {} }
  ],
  standard: [
    { tag_name: 'p', attributes: { class: { type: 'string' } } },
    { tag_name: 'br', attributes: {}, is_void: true },
    { tag_name: 'strong', attributes: {} },
    { tag_name: 'em', attributes: {} },
    { tag_name: 'u', attributes: {} },
    { tag_name: 'strike', attributes: {} },
    { tag_name: 'h1', attributes: { id: { type: 'string' }, class: { type: 'string' } } },
    { tag_name: 'h2', attributes: { id: { type: 'string' }, class: { type: 'string' } } },
    { tag_name: 'h3', attributes: { id: { type: 'string' }, class: { type: 'string' } } },
    { tag_name: 'h4', attributes: { id: { type: 'string' }, class: { type: 'string' } } },
    { tag_name: 'h5', attributes: { id: { type: 'string' }, class: { type: 'string' } } },
    { tag_name: 'h6', attributes: { id: { type: 'string' }, class: { type: 'string' } } },
    { tag_name: 'blockquote', attributes: { cite: { type: 'url' } } },
    { tag_name: 'ul', attributes: { class: { type: 'string' } } },
    { tag_name: 'ol', attributes: { class: { type: 'string' } } },
    { tag_name: 'li', attributes: {} },
    { tag_name: 'a', attributes: { href: { type: 'url', required: true }, target: { type: 'string' }, title: { type: 'string' } } },
    { tag_name: 'img', attributes: { src: { type: 'url', required: true }, alt: { type: 'string' }, width: { type: 'number' }, height: { type: 'number' } }, is_void: true }
  ],
  full: [
    { tag_name: 'p', attributes: { class: { type: 'string' }, id: { type: 'string' } } },
    { tag_name: 'br', attributes: {}, is_void: true },
    { tag_name: 'hr', attributes: { class: { type: 'string' } }, is_void: true },
    { tag_name: 'strong', attributes: {} },
    { tag_name: 'em', attributes: {} },
    { tag_name: 'u', attributes: {} },
    { tag_name: 'strike', attributes: {} },
    { tag_name: 'sub', attributes: {} },
    { tag_name: 'sup', attributes: {} },
    { tag_name: 'h1', attributes: { id: { type: 'string' }, class: { type: 'string' } } },
    { tag_name: 'h2', attributes: { id: { type: 'string' }, class: { type: 'string' } } },
    { tag_name: 'h3', attributes: { id: { type: 'string' }, class: { type: 'string' } } },
    { tag_name: 'h4', attributes: { id: { type: 'string' }, class: { type: 'string' } } },
    { tag_name: 'h5', attributes: { id: { type: 'string' }, class: { type: 'string' } } },
    { tag_name: 'h6', attributes: { id: { type: 'string' }, class: { type: 'string' } } },
    { tag_name: 'blockquote', attributes: { cite: { type: 'url' }, class: { type: 'string' } } },
    { tag_name: 'pre', attributes: { class: { type: 'string' } } },
    { tag_name: 'code', attributes: { class: { type: 'string' } } },
    { tag_name: 'ul', attributes: { class: { type: 'string' } } },
    { tag_name: 'ol', attributes: { class: { type: 'string' }, start: { type: 'number' } } },
    { tag_name: 'li', attributes: { value: { type: 'number' } } },
    { tag_name: 'dl', attributes: { class: { type: 'string' } } },
    { tag_name: 'dt', attributes: {} },
    { tag_name: 'dd', attributes: {} },
    { tag_name: 'a', attributes: { href: { type: 'url', required: true }, target: { type: 'string' }, title: { type: 'string' }, rel: { type: 'string' } } },
    { tag_name: 'img', attributes: { src: { type: 'url', required: true }, alt: { type: 'string' }, width: { type: 'number' }, height: { type: 'number' }, class: { type: 'string' } }, is_void: true },
    { tag_name: 'table', attributes: { class: { type: 'string' }, border: { type: 'number' } } },
    { tag_name: 'thead', attributes: {} },
    { tag_name: 'tbody', attributes: {} },
    { tag_name: 'tfoot', attributes: {} },
    { tag_name: 'tr', attributes: { class: { type: 'string' } } },
    { tag_name: 'th', attributes: { colspan: { type: 'number' }, rowspan: { type: 'number' }, scope: { type: 'string' } } },
    { tag_name: 'td', attributes: { colspan: { type: 'number' }, rowspan: { type: 'number' } } },
    { tag_name: 'div', attributes: { class: { type: 'string' }, id: { type: 'string' } } },
    { tag_name: 'span', attributes: { class: { type: 'string' }, id: { type: 'string' } } },
    { tag_name: 'section', attributes: { class: { type: 'string' }, id: { type: 'string' } } },
    { tag_name: 'article', attributes: { class: { type: 'string' }, id: { type: 'string' } } },
    { tag_name: 'header', attributes: { class: { type: 'string' }, id: { type: 'string' } } },
    { tag_name: 'footer', attributes: { class: { type: 'string' }, id: { type: 'string' } } },
    { tag_name: 'nav', attributes: { class: { type: 'string' }, id: { type: 'string' } } },
    { tag_name: 'aside', attributes: { class: { type: 'string' }, id: { type: 'string' } } },
    { tag_name: 'figure', attributes: { class: { type: 'string' }, id: { type: 'string' } } },
    { tag_name: 'figcaption', attributes: {} },
    { tag_name: 'iframe', attributes: { src: { type: 'url', required: true }, width: { type: 'number' }, height: { type: 'number' }, frameborder: { type: 'number' } } },
    { tag_name: 'video', attributes: { src: { type: 'url' }, width: { type: 'number' }, height: { type: 'number' }, controls: { type: 'boolean' } } },
    { tag_name: 'audio', attributes: { src: { type: 'url' }, controls: { type: 'boolean' } } },
    { tag_name: 'source', attributes: { src: { type: 'url', required: true }, type: { type: 'string' } }, is_void: true }
  ]
};

// Available TinyMCE plugins
export const AVAILABLE_PLUGINS = [
  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
  'insertdatetime', 'media', 'table', 'help', 'wordcount', 'pagebreak',
  'emoticons', 'template', 'codesample', 'directionality', 'nonbreaking',
  'visualchars', 'quickbars', 'save', 'importcss', 'autoresize', 'autosave'
];

// Available toolbar buttons
export const TOOLBAR_BUTTONS = [
  // Basic formatting
  { id: 'bold', label: 'Bold', icon: 'bold' },
  { id: 'italic', label: 'Italic', icon: 'italic' },
  { id: 'underline', label: 'Underline', icon: 'underline' },
  { id: 'strikethrough', label: 'Strikethrough', icon: 'strikethrough' },
  { id: 'subscript', label: 'Subscript', icon: 'subscript' },
  { id: 'superscript', label: 'Superscript', icon: 'superscript' },
  
  // Text alignment
  { id: 'alignleft', label: 'Align Left', icon: 'align-left' },
  { id: 'aligncenter', label: 'Align Center', icon: 'align-center' },
  { id: 'alignright', label: 'Align Right', icon: 'align-right' },
  { id: 'alignjustify', label: 'Justify', icon: 'align-justify' },
  
  // Lists
  { id: 'bullist', label: 'Bullet List', icon: 'unordered-list' },
  { id: 'numlist', label: 'Numbered List', icon: 'ordered-list' },
  { id: 'outdent', label: 'Decrease Indent', icon: 'outdent' },
  { id: 'indent', label: 'Increase Indent', icon: 'indent' },
  
  // Blocks
  { id: 'formatselect', label: 'Format', icon: 'format' },
  { id: 'blockquote', label: 'Blockquote', icon: 'quote' },
  { id: 'hr', label: 'Horizontal Rule', icon: 'horizontal-rule' },
  { id: 'pagebreak', label: 'Page Break', icon: 'page-break' },
  
  // Insert
  { id: 'link', label: 'Insert/Edit Link', icon: 'link' },
  { id: 'unlink', label: 'Remove Link', icon: 'unlink' },
  { id: 'image', label: 'Insert/Edit Image', icon: 'image' },
  { id: 'media', label: 'Insert/Edit Media', icon: 'media' },
  { id: 'table', label: 'Table', icon: 'table' },
  { id: 'charmap', label: 'Special Character', icon: 'special-character' },
  { id: 'emoticons', label: 'Emoticons', icon: 'emoticons' },
  { id: 'anchor', label: 'Anchor', icon: 'anchor' },
  { id: 'codesample', label: 'Code Sample', icon: 'code-sample' },
  { id: 'insertdatetime', label: 'Insert Date/Time', icon: 'date-time' },
  
  // Tools
  { id: 'undo', label: 'Undo', icon: 'undo' },
  { id: 'redo', label: 'Redo', icon: 'redo' },
  { id: 'removeformat', label: 'Clear Formatting', icon: 'remove-formatting' },
  { id: 'visualblocks', label: 'Visual Blocks', icon: 'visualblocks' },
  { id: 'visualchars', label: 'Visual Characters', icon: 'visualchars' },
  { id: 'code', label: 'Source Code', icon: 'sourcecode' },
  { id: 'fullscreen', label: 'Fullscreen', icon: 'fullscreen' },
  { id: 'preview', label: 'Preview', icon: 'preview' },
  { id: 'searchreplace', label: 'Find and Replace', icon: 'search' },
  { id: 'help', label: 'Help', icon: 'help' },
  
  // Save
  { id: 'save', label: 'Save', icon: 'save' },
  { id: 'cancel', label: 'Cancel', icon: 'close' },
  
  // Special
  { id: '|', label: 'Separator', icon: 'separator', special: true }
];

export default {
  profileService,
  toolbarPresetService,
  allowedTagsService,
  featureFlagsService
};