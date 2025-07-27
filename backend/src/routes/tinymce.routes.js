const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth.middleware');
const {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  duplicateProfile,
  getCompiledConfig,
  getToolbarPresets,
  getAllowedTags,
  updateAllowedTags,
  getFeatureFlags,
  updateFeatureFlags
} = require('../controllers/tinymceController');
const { SiteSettings, TinymceSettings } = require('../models');

// All routes require authentication
router.use(protect);

// Profile management routes
// GET /api/tinymce/profiles - List all profiles (with access control)
router.get('/profiles', getProfiles);

// GET /api/tinymce/profiles/:id - Get specific profile
router.get('/profiles/:id', getProfile);

// POST /api/tinymce/profiles - Create new profile
router.post('/profiles', createProfile);

// PUT /api/tinymce/profiles/:id - Update profile
router.put('/profiles/:id', updateProfile);

// DELETE /api/tinymce/profiles/:id - Delete profile (protect system profiles)
router.delete('/profiles/:id', deleteProfile);

// POST /api/tinymce/profiles/:id/duplicate - Duplicate a profile
router.post('/profiles/:id/duplicate', duplicateProfile);

// GET /api/tinymce/profiles/:id/config - Get compiled TinyMCE config
router.get('/profiles/:id/config', getCompiledConfig);

// Toolbar presets route
// GET /api/tinymce/toolbar-presets - List toolbar presets
router.get('/toolbar-presets', getToolbarPresets);

// Allowed tags routes
// GET /api/tinymce/profiles/:id/allowed-tags - Get allowed tags for profile
router.get('/profiles/:id/allowed-tags', getAllowedTags);

// PUT /api/tinymce/profiles/:id/allowed-tags - Update allowed tags
router.put('/profiles/:id/allowed-tags', updateAllowedTags);

// Feature flags routes
// GET /api/tinymce/profiles/:id/features - Get feature flags
router.get('/profiles/:id/features', getFeatureFlags);

// PUT /api/tinymce/profiles/:id/features - Update feature flags
router.put('/profiles/:id/features', updateFeatureFlags);

// Default profile settings
// GET /api/tinymce/default-profile - Get the default profile for all content types
router.get('/default-profile', async (req, res) => {
  try {
    const defaultProfileId = await SiteSettings.getSetting('default_tinymce_profile');
    res.json({ profileId: defaultProfileId });
  } catch (error) {
    console.error('Error getting default profile:', error);
    res.status(500).json({ error: 'Failed to get default profile' });
  }
});

// PUT /api/tinymce/default-profile - Set the default profile for all content types
router.put('/default-profile', async (req, res) => {
  try {
    // Check if user has permission to change settings (only superuser)
    if (req.user.role !== 'superuser') {
      return res.status(403).json({ error: 'Only superusers can change default settings' });
    }

    const { profileId } = req.body;
    
    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }

    // Verify the profile exists
    const profile = await TinymceSettings.findByPk(profileId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Save the setting
    await SiteSettings.setSetting(
      'default_tinymce_profile',
      profileId,
      `Default TinyMCE profile for all content types. Set to: ${profile.name}`
    );

    res.json({
      success: true,
      profileId,
      profileName: profile.name,
      message: `Default profile set to "${profile.name}" for all content types`
    });
  } catch (error) {
    console.error('Error setting default profile:', error);
    res.status(500).json({ error: 'Failed to set default profile' });
  }
});

module.exports = router;