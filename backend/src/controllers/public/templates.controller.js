const { models } = require('../../database');

// Get active template by type
exports.getActiveTemplate = async (req, res) => {
  try {
    const { type } = req.params;
    
    const template = await models.Template.findOne({
      where: {
        type: type,
        isActive: true
      }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'No active template found for this type'
      });
    }

    res.json({
      success: true,
      template: template
    });
  } catch (error) {
    console.error('Error fetching active template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active template',
      error: error.message
    });
  }
};

// Get template by slug (for public access)
exports.getTemplateBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const template = await models.Template.findOne({
      where: {
        slug: slug
      }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.json({
      success: true,
      template: template
    });
  } catch (error) {
    console.error('Error fetching template by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template',
      error: error.message
    });
  }
};