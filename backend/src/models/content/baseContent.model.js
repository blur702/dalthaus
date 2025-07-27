const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

// Base content model with common fields
const BaseContent = sequelize.define('BaseContent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      is: /^[a-z0-9-]+$/i
    }
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  },
  featuredImage: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrlOrPath(value) {
        if (!value) return; // Allow null/empty
        // Allow both full URLs and relative paths starting with /
        const isUrl = /^https?:\/\/.+/.test(value);
        const isPath = /^\/[\w\-\.\/]+$/.test(value);
        if (!isUrl && !isPath) {
          throw new Error('Featured image must be a valid URL or file path');
        }
      }
    }
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Brief summary of the content for listing pages'
  },
  teaserImage: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'teaser_image',
    validate: {
      isUrlOrPath(value) {
        if (!value) return; // Allow null/empty
        // Allow both full URLs and relative paths starting with /
        const isUrl = /^https?:\/\/.+/.test(value);
        const isPath = /^\/[\w\-\.\/]+$/.test(value);
        if (!isUrl && !isPath) {
          throw new Error('Teaser image must be a valid URL or file path');
        }
      }
    },
    comment: 'Image URL for content listings/teasers'
  },
  featuredImageAlt: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'featured_image_alt',
    comment: 'Alt text for featured image accessibility'
  },
  teaserImageAlt: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'teaser_image_alt',
    comment: 'Alt text for teaser image accessibility'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
    allowNull: false
  },
  contentType: {
    type: DataTypes.ENUM('photoBook', 'article', 'page'),
    allowNull: false
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    allowNull: false
  },
  // Additional field to reference parent content (for pages)
  parentId: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'content',
  timestamps: true,
  hooks: {
    beforeValidate: (content) => {
      // Auto-generate slug from title if not provided
      if (!content.slug && content.title) {
        content.slug = content.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }
    },
    beforeUpdate: (content) => {
      // Set publishedAt when status changes to published
      if (content.changed('status') && content.status === 'published' && !content.publishedAt) {
        content.publishedAt = new Date();
      }
    },
    beforeSave: (content) => {
      // Extract page count from content
      if (content.body) {
        // Normalize pagebreaks to HTML comments for storage
        content.body = content.body.replace(/<hr[^>]*class="mce-pagebreak"[^>]*>/gi, '<!-- pagebreak -->');
        content.body = content.body.replace(/<hr[^>]*data-mce-pagebreak[^>]*>/gi, '<!-- pagebreak -->');
        content.body = content.body.replace(/<div[^>]*class="mce-pagebreak"[^>]*>.*?<\/div>/gi, '<!-- pagebreak -->');
        
        // Handle our custom pagebreak format - be more flexible
        content.body = content.body.replace(/<div[^>]*class="custom-pagebreak"[^>]*>[\s\S]*?<\/div>\s*<!-- pagebreak -->/gi, '<!-- pagebreak -->');
        
        // Also handle case where there's no comment after the div
        content.body = content.body.replace(/<div[^>]*class="custom-pagebreak"[^>]*>[\s\S]*?<\/div>/gi, '<!-- pagebreak -->');
        
        // Count pagebreaks
        const pageBreaks = (content.body.match(/<!-- pagebreak -->/g) || []).length;
        const pageCount = pageBreaks + 1; // +1 for the first page
        
        // Update metadata with page information
        if (!content.metadata) {
          content.metadata = {};
        }
        content.metadata.pageCount = pageCount;
        content.metadata.hasPageBreaks = pageBreaks > 0;
      }
    }
  }
});

module.exports = BaseContent;