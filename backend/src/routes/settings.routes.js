const express = require('express');
const router = express.Router();
const { SiteSettings } = require('../models');
const { protect } = require('../middleware/auth.middleware');
const Sequelize = require('sequelize');

// Get site settings
router.get('/site', protect, async (req, res) => {
  try {
    // There should only be one site settings record
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await SiteSettings.create({
        siteName: 'My CMS Site',
        siteDescription: 'A powerful content management system',
        timezone: 'America/New_York'
      });
    }
    
    res.json(settings);
  } catch (error) {
    // Removed console statement
    res.status(500).json({ error: 'Failed to fetch site settings' });
  }
});

// Update site settings
router.put('/site', protect, async (req, res) => {
  try {
    const {
      siteName,
      siteDescription,
      faviconUrl,
      metaKeywords,
      metaAuthor,
      contactEmail,
      copyrightText,
      googleAnalyticsId,
      timezone,
      maintenanceMode,
      maintenanceMessage,
      maintenanceBypassIps
    } = req.body;

    // Validate required fields
    if (!siteName) {
      return res.status(400).json({ error: 'Site name is required' });
    }

    // Find existing settings or create new
    let settings = await SiteSettings.findOne();
    
    if (settings) {
      // Update existing settings
      await settings.update({
        siteName,
        siteDescription,
        faviconUrl,
        metaKeywords,
        metaAuthor,
        contactEmail,
        copyrightText,
        googleAnalyticsId,
        timezone,
        maintenanceMode,
        maintenanceMessage,
        maintenanceBypassIps
      });
    } else {
      // Create new settings
      settings = await SiteSettings.create({
        siteName,
        siteDescription,
        faviconUrl,
        metaKeywords,
        metaAuthor,
        contactEmail,
        copyrightText,
        googleAnalyticsId,
        timezone,
        maintenanceMode,
        maintenanceMessage,
        maintenanceBypassIps
      });
    }

    res.json({ 
      message: 'Site settings updated successfully',
      settings 
    });
  } catch (error) {
    // Removed console statement
    
    // Handle validation errors
    if (error instanceof Sequelize.ValidationError) {
      const errors = error.errors.map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: 'Failed to update site settings' });
  }
});

// Get maintenance status (no auth required)
router.get('/maintenance-status', async (req, res) => {
  try {
    const settings = await SiteSettings.findOne({
      attributes: ['maintenanceMode', 'maintenanceMessage']
    });
    
    if (!settings) {
      return res.json({
        maintenanceMode: false,
        maintenanceMessage: null
      });
    }
    
    res.json({
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage
    });
  } catch (error) {
    // Removed console statement
    res.status(500).json({ error: 'Failed to fetch maintenance status' });
  }
});

// Get public settings (no auth required)
router.get('/public', async (req, res) => {
  try {
    const settings = await SiteSettings.findOne({
      attributes: [
        'siteName',
        'siteDescription',
        'faviconUrl',
        'metaKeywords',
        'metaAuthor',
        'copyrightText',
        'googleAnalyticsId'
      ]
    });
    
    if (!settings) {
      return res.json({
        siteName: 'My CMS Site',
        siteDescription: 'A powerful content management system'
      });
    }
    
    res.json(settings);
  } catch (error) {
    // Removed console statement
    res.status(500).json({ error: 'Failed to fetch public settings' });
  }
});

module.exports = router;