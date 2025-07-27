const { models } = require('../database');
const { Op } = require('sequelize');
const Template = models.Template;

// Get all templates
exports.getAllTemplates = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    
    const where = {};
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    
    const templates = await Template.findAll({
      where,
      order: [['name', 'ASC']],
      include: [
        {
          association: 'creator',
          attributes: ['id', 'username']
        },
        {
          association: 'lastEditor',
          attributes: ['id', 'username']
        }
      ]
    });
    
    res.json({
      success: true,
      count: templates.length,
      templates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching templates',
      error: error.message
    });
  }
};

// Get single template by ID or slug
exports.getTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    
    const where = {};
    // Check if it's a UUID or a slug
    if (id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      where.id = id;
    } else {
      where.slug = id;
    }
    
    const template = await Template.findOne({
      where,
      include: [
        {
          association: 'creator',
          attributes: ['id', 'username']
        },
        {
          association: 'lastEditor',
          attributes: ['id', 'username']
        }
      ]
    });
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    res.json({
      success: true,
      template
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching template',
      error: error.message
    });
  }
};

// Get active template by type
exports.getActiveTemplate = async (req, res) => {
  try {
    const { type } = req.params;
    
    const template = await Template.getActiveByType(type);
    
    if (!template) {
      // Try to get default template
      const defaultTemplate = await Template.getDefaultByType(type);
      
      if (!defaultTemplate) {
        return res.status(404).json({
          success: false,
          message: `No active or default template found for type: ${type}`
        });
      }
      
      return res.json({
        success: true,
        template: defaultTemplate,
        isDefault: true
      });
    }
    
    res.json({
      success: true,
      template,
      isDefault: false
    });
  } catch (error) {
    console.error('Error fetching active template:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active template',
      error: error.message
    });
  }
};

// Create new template
exports.createTemplate = async (req, res) => {
  try {
    const {
      name,
      slug,
      type,
      description,
      configuration,
      headerSettings,
      footerSettings,
      layoutSettings,
      globalSettings,
      isActive,
      metadata
    } = req.body;
    
    const userId = req.user?.id;
    
    // Validate required fields
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Name and type are required'
      });
    }
    
    const templateData = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type,
      description,
      configuration: configuration || {},
      headerSettings: headerSettings || {},
      footerSettings: footerSettings || {},
      layoutSettings: layoutSettings || {},
      globalSettings: globalSettings || {},
      isActive: isActive || false,
      metadata: metadata || {},
      createdBy: userId,
      updatedBy: userId
    };
    
    const template = await Template.create(templateData);
    
    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      template
    });
  } catch (error) {
    console.error('Error creating template:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'A template with this name or slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating template',
      error: error.message
    });
  }
};

// Update template
exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const template = await Template.findByPk(id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    // Don't allow editing default templates
    if (template.isDefault) {
      return res.status(403).json({
        success: false,
        message: 'Default templates cannot be modified'
      });
    }
    
    const {
      name,
      slug,
      description,
      configuration,
      headerSettings,
      footerSettings,
      layoutSettings,
      globalSettings,
      isActive,
      metadata
    } = req.body;
    
    const updateData = {
      updatedBy: userId,
      version: template.version + 1
    };
    
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (configuration !== undefined) updateData.configuration = configuration;
    if (headerSettings !== undefined) updateData.headerSettings = headerSettings;
    if (footerSettings !== undefined) updateData.footerSettings = footerSettings;
    if (layoutSettings !== undefined) updateData.layoutSettings = layoutSettings;
    if (globalSettings !== undefined) updateData.globalSettings = globalSettings;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (metadata !== undefined) updateData.metadata = metadata;
    
    await template.update(updateData);
    
    res.json({
      success: true,
      message: 'Template updated successfully',
      template
    });
  } catch (error) {
    console.error('Error updating template:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'A template with this name or slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating template',
      error: error.message
    });
  }
};

// Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    
    const template = await Template.findByPk(id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    // Don't allow deleting default or active templates
    if (template.isDefault) {
      return res.status(403).json({
        success: false,
        message: 'Default templates cannot be deleted'
      });
    }
    
    if (template.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Active templates cannot be deleted. Please deactivate it first.'
      });
    }
    
    await template.destroy();
    
    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting template',
      error: error.message
    });
  }
};

// Clone template
exports.cloneTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;
    const userId = req.user?.id;
    
    const sourceTemplate = await Template.findByPk(id);
    
    if (!sourceTemplate) {
      return res.status(404).json({
        success: false,
        message: 'Source template not found'
      });
    }
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required for cloned template'
      });
    }
    
    const clonedData = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: sourceTemplate.type,
      description: `Cloned from ${sourceTemplate.name}`,
      configuration: sourceTemplate.configuration,
      headerSettings: sourceTemplate.headerSettings,
      footerSettings: sourceTemplate.footerSettings,
      layoutSettings: sourceTemplate.layoutSettings,
      globalSettings: sourceTemplate.globalSettings,
      isActive: false,
      isDefault: false,
      metadata: {
        ...sourceTemplate.metadata,
        clonedFrom: sourceTemplate.id,
        clonedAt: new Date()
      },
      createdBy: userId,
      updatedBy: userId
    };
    
    const clonedTemplate = await Template.create(clonedData);
    
    res.status(201).json({
      success: true,
      message: 'Template cloned successfully',
      template: clonedTemplate
    });
  } catch (error) {
    console.error('Error cloning template:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'A template with this name or slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error cloning template',
      error: error.message
    });
  }
};

// Export template configuration
exports.exportTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    
    const template = await Template.findByPk(id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    const exportData = {
      name: template.name,
      slug: template.slug,
      type: template.type,
      description: template.description,
      configuration: template.configuration,
      headerSettings: template.headerSettings,
      footerSettings: template.footerSettings,
      layoutSettings: template.layoutSettings,
      globalSettings: template.globalSettings,
      metadata: template.metadata,
      exportedAt: new Date(),
      version: template.version
    };
    
    res.json({
      success: true,
      template: exportData
    });
  } catch (error) {
    console.error('Error exporting template:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting template',
      error: error.message
    });
  }
};

// Import template configuration
exports.importTemplate = async (req, res) => {
  try {
    const templateData = req.body;
    const userId = req.user?.id;
    
    if (!templateData.name || !templateData.type) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template data: name and type are required'
      });
    }
    
    // Add import suffix to avoid conflicts
    const importedName = `${templateData.name} (Imported)`;
    const importedSlug = `${templateData.slug || templateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-imported-${Date.now()}`;
    
    const template = await Template.create({
      ...templateData,
      name: importedName,
      slug: importedSlug,
      isActive: false,
      isDefault: false,
      metadata: {
        ...templateData.metadata,
        importedAt: new Date(),
        originalName: templateData.name
      },
      createdBy: userId,
      updatedBy: userId
    });
    
    res.status(201).json({
      success: true,
      message: 'Template imported successfully',
      template
    });
  } catch (error) {
    console.error('Error importing template:', error);
    res.status(500).json({
      success: false,
      message: 'Error importing template',
      error: error.message
    });
  }
};

// Get global template settings
exports.getGlobalSettings = async (req, res) => {
  try {
    // First check if we have a global settings template
    let globalTemplate = await Template.findOne({
      where: {
        type: 'global_settings',
        isActive: true
      }
    });

    // If no global settings exist, create default ones
    if (!globalTemplate) {
      globalTemplate = await Template.create({
        name: 'Global Settings',
        slug: 'global-settings',
        type: 'global_settings',
        description: 'Global design system settings for all templates',
        isActive: true,
        isDefault: true,
        configuration: {},
        globalSettings: {
          // Typography
          primaryFont: 'Roboto',
          secondaryFont: 'Open Sans',
          baseFontSize: 16,
          fontScale: 1.25,
          headingWeight: 700,
          bodyWeight: 400,
          lineHeight: 1.6,
          letterSpacing: 0,
          paragraphSpacing: 1,
          
          // Colors
          primaryColor: '#1976d2',
          secondaryColor: '#dc004e',
          textColor: '#333333',
          backgroundColor: '#ffffff',
          surfaceColor: '#f5f5f5',
          errorColor: '#f44336',
          warningColor: '#ff9800',
          infoColor: '#2196f3',
          successColor: '#4caf50',
          
          // Body Settings
          bodyBackgroundColor: '#ffffff',
          bodyTextColor: '#333333',
          bodyLinkColor: '#1976d2',
          bodyLinkHoverColor: '#115293',
          
          // Spacing
          containerMaxWidth: 1200,
          containerPadding: 24,
          sectionSpacing: 80,
          elementSpacing: 24,
          componentSpacing: 16,
          
          // Border & Effects
          borderRadius: 4,
          borderColor: '#e0e0e0',
          borderWidth: 1,
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
        },
        createdBy: req.user.id,
        updatedBy: req.user.id
      });
    }

    res.json({
      success: true,
      settings: globalTemplate
    });
  } catch (error) {
    console.error('Error fetching global settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching global settings',
      error: error.message
    });
  }
};

// Update global template settings
exports.updateGlobalSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const userId = req.user.id;

    // Find or create global settings template
    let globalTemplate = await Template.findOne({
      where: {
        type: 'global_settings',
        isActive: true
      }
    });

    if (globalTemplate) {
      // Update existing
      await globalTemplate.update({
        globalSettings: settings,
        updatedBy: userId
      });
    } else {
      // Create new
      globalTemplate = await Template.create({
        name: 'Global Settings',
        slug: 'global-settings',
        type: 'global_settings',
        description: 'Global design system settings for all templates',
        isActive: true,
        isDefault: true,
        configuration: {},
        globalSettings: settings,
        createdBy: userId,
        updatedBy: userId
      });
    }

    res.json({
      success: true,
      message: 'Global settings updated successfully',
      settings: globalTemplate
    });
  } catch (error) {
    console.error('Error updating global settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating global settings',
      error: error.message
    });
  }
};