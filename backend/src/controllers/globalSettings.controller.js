const { models } = require('../database');
const GlobalSettings = models.GlobalSettings;
const path = require('path');
const fs = require('fs').promises;

// Get global settings
exports.getGlobalSettings = async (req, res) => {
  try {
    const settings = await GlobalSettings.getDefault();
    
    res.json({
      success: true,
      settings: settings.settings
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

// Update global settings
exports.updateGlobalSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const userId = req.user?.id;
    
    if (!settings) {
      return res.status(400).json({
        success: false,
        message: 'Settings data is required'
      });
    }
    
    const updatedSettings = await GlobalSettings.updateDefault(settings, userId);
    
    res.json({
      success: true,
      message: 'Global settings updated successfully',
      settings: updatedSettings.settings
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

// Reset global settings to defaults
exports.resetGlobalSettings = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const resetSettings = await GlobalSettings.resetToDefaults(userId);
    
    res.json({
      success: true,
      message: 'Global settings reset to defaults',
      settings: resetSettings.settings
    });
  } catch (error) {
    console.error('Error resetting global settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting global settings',
      error: error.message
    });
  }
};

// Get global settings with metadata (for admin view)
exports.getGlobalSettingsWithMetadata = async (req, res) => {
  try {
    const settings = await GlobalSettings.getDefault();
    
    // Include last modifier information
    await settings.reload({
      include: [{
        association: 'lastModifier',
        attributes: ['id', 'username', 'email']
      }]
    });
    
    res.json({
      success: true,
      settings: settings.settings,
      metadata: {
        version: settings.version,
        lastModified: settings.updatedAt,
        lastModifiedBy: settings.lastModifier
      }
    });
  } catch (error) {
    console.error('Error fetching global settings with metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching global settings',
      error: error.message
    });
  }
};

// Export global settings for backup
exports.exportGlobalSettings = async (req, res) => {
  try {
    const settings = await GlobalSettings.getDefault();
    
    const exportData = {
      settings: settings.settings,
      exportedAt: new Date(),
      version: settings.version
    };
    
    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    console.error('Error exporting global settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting global settings',
      error: error.message
    });
  }
};

// Import global settings from backup
exports.importGlobalSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const userId = req.user?.id;
    
    if (!settings) {
      return res.status(400).json({
        success: false,
        message: 'Settings data is required'
      });
    }
    
    const updatedSettings = await GlobalSettings.updateDefault(settings, userId);
    
    res.json({
      success: true,
      message: 'Global settings imported successfully',
      settings: updatedSettings.settings
    });
  } catch (error) {
    console.error('Error importing global settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error importing global settings',
      error: error.message
    });
  }
};

// Upload header background image
exports.uploadHeaderImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No image file provided' 
      });
    }

    const userId = req.user?.id;
    const imageUrl = `/uploads/headers/${req.file.filename}`;
    
    // Get current settings
    const settings = await GlobalSettings.getDefault();
    const currentSettings = settings.settings;
    
    // Delete old header image if exists
    if (currentSettings.headerBackgroundImage) {
      const oldImagePath = path.join(__dirname, '../../../', currentSettings.headerBackgroundImage);
      try {
        await fs.unlink(oldImagePath);
      } catch (error) {
        // Ignore error if file doesn't exist
        console.log('Could not delete old header image:', error.message);
      }
    }
    
    // Update settings with new image URL
    const updatedSettings = await GlobalSettings.updateDefault({
      headerBackgroundImage: imageUrl
    }, userId);
    
    res.json({
      success: true,
      message: 'Header background image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Header image upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to upload header image',
      error: error.message 
    });
  }
};

// Delete header background image
exports.deleteHeaderImage = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    // Get current settings
    const settings = await GlobalSettings.getDefault();
    const currentSettings = settings.settings;
    
    if (!currentSettings.headerBackgroundImage) {
      return res.status(404).json({
        success: false,
        message: 'No header background image to delete'
      });
    }
    
    // Delete the image file
    const imagePath = path.join(__dirname, '../../../', currentSettings.headerBackgroundImage);
    try {
      await fs.unlink(imagePath);
    } catch (error) {
      console.log('Could not delete header image file:', error.message);
    }
    
    // Update settings to remove image URL
    await GlobalSettings.updateDefault({
      headerBackgroundImage: null
    }, userId);
    
    res.json({
      success: true,
      message: 'Header background image deleted successfully'
    });
  } catch (error) {
    console.error('Header image deletion error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete header image',
      error: error.message 
    });
  }
};