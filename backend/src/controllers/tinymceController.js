const { Op } = require('sequelize');
const {
  TinymceSettings,
  TinymceToolbarPresets,
  TinymceAllowedTags,
  TinymceFeatureFlags,
  User
} = require('../models');

// List all profiles with access control
const getProfiles = async (req, res) => {
  try {
    console.log('=== GET PROFILES DEBUG ===');
    console.log('Request user:', req.user ? { id: req.user.id, username: req.user.username, role: req.user.role } : 'No user');
    
    const { user } = req;
    let whereClause = {};

    // Non-admin users can only see system profiles and their own profiles
    if (user.role !== 'admin' && user.role !== 'superuser') {
      whereClause = {
        [Op.or]: [
          { profileType: 'system' },
          { createdBy: user.id },
          { allowedUsers: { [Op.contains]: [user.id] } },
          { allowedRoles: { [Op.contains]: [user.role] } }
        ]
      };
    }

    console.log('Where clause:', JSON.stringify(whereClause, null, 2));

    const profiles = await TinymceSettings.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username']
        },
        {
          model: User,
          as: 'updater',
          attributes: ['id', 'username']
        }
      ],
      order: [['priority', 'DESC'], ['name', 'ASC']]
    });

    console.log(`Found ${profiles.length} profiles`);
    res.json(profiles);
  } catch (error) {
    console.error('=== ERROR IN GET PROFILES ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
};

// Get specific profile
const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const profile = await TinymceSettings.findByPk(id, {
      include: [
        { 
          model: User, 
          as: 'creator', 
          attributes: ['id', 'username'] 
        },
        { 
          model: User, 
          as: 'updater', 
          attributes: ['id', 'username'] 
        },
        {
          model: TinymceAllowedTags,
          as: 'allowedTags'
        },
        {
          model: TinymceFeatureFlags,
          as: 'features'
        }
      ]
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check access permissions
    if (!profile.canBeAccessedBy(user)) {
      return res.status(403).json({ error: 'Access denied to this profile' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Create new profile
const createProfile = async (req, res) => {
  try {
    const { user } = req;
    const {
      name,
      description,
      settings,
      isDefault,
      tags,
      profileType,
      priority,
      conditions,
      allowedUsers,
      allowedRoles
    } = req.body;

    // Validate required fields
    if (!name || !settings) {
      return res.status(400).json({ error: 'Name and settings are required' });
    }

    // Ensure pagebreak plugin is included
    if (settings.plugins && !settings.plugins.includes('pagebreak')) {
      settings.plugins.push('pagebreak');
    }

    // Non-admin users can only create custom profiles
    if (user.role !== 'admin' && user.role !== 'superuser' && profileType !== 'custom') {
      return res.status(403).json({ error: 'Only admins can create non-custom profile types' });
    }

    const profile = await TinymceSettings.create({
      name,
      description,
      settings,
      isDefault: isDefault || false,
      isPreset: false,
      tags: tags || [],
      profileType: profileType || 'custom',
      priority: priority || 0,
      conditions: conditions || {},
      allowedUsers: allowedUsers || [],
      allowedRoles: allowedRoles || [],
      createdBy: user.id,
      updatedBy: user.id
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating profile:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Profile name already exists' });
    }
    res.status(500).json({ error: 'Failed to create profile' });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const updates = req.body;

    const profile = await TinymceSettings.findByPk(id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check permissions
    if (profile.profileType === 'system' && user.role !== 'superuser') {
      return res.status(403).json({ error: 'Only superusers can modify system profiles' });
    }

    if (profile.createdBy !== user.id && user.role !== 'admin' && user.role !== 'superuser') {
      return res.status(403).json({ error: 'You can only edit your own profiles' });
    }

    // Prevent modification of system presets
    if (profile.isPreset && profile.profileType === 'system') {
      return res.status(403).json({ error: 'System presets cannot be modified' });
    }

    // Ensure pagebreak plugin remains included
    if (updates.settings && updates.settings.plugins) {
      if (!updates.settings.plugins.includes('pagebreak')) {
        updates.settings.plugins.push('pagebreak');
      }
    }

    // Update the profile
    updates.updatedBy = user.id;
    await profile.update(updates);

    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Profile name already exists' });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Delete profile
const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const profile = await TinymceSettings.findByPk(id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Prevent deletion of locked profiles
    if (profile.isLocked) {
      return res.status(403).json({ error: 'This profile is locked and cannot be deleted' });
    }

    // Prevent deletion of system profiles
    if (profile.profileType === 'system') {
      return res.status(403).json({ error: 'System profiles cannot be deleted' });
    }

    // Check permissions
    if (profile.createdBy !== user.id && user.role !== 'admin' && user.role !== 'superuser') {
      return res.status(403).json({ error: 'You can only delete your own profiles' });
    }

    await profile.destroy();

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
};

// Duplicate a profile
const duplicateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'New profile name is required' });
    }

    const originalProfile = await TinymceSettings.findByPk(id);

    if (!originalProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check access permissions
    if (!originalProfile.canBeAccessedBy(user)) {
      return res.status(403).json({ error: 'Access denied to this profile' });
    }

    const newProfile = await originalProfile.duplicate(name, user.id);

    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Error duplicating profile:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Profile name already exists' });
    }
    res.status(500).json({ error: 'Failed to duplicate profile' });
  }
};

// Get compiled TinyMCE configuration
const getCompiledConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const profile = await TinymceSettings.findByPk(id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check access permissions
    if (!profile.canBeAccessedBy(user)) {
      return res.status(403).json({ error: 'Access denied to this profile' });
    }

    const config = await TinymceSettings.compileConfiguration(id);

    // Increment usage count
    await profile.incrementUsageCount();

    res.json(config);
  } catch (error) {
    console.error('Error compiling configuration:', error);
    res.status(500).json({ error: 'Failed to compile configuration' });
  }
};

// List toolbar presets
const getToolbarPresets = async (req, res) => {
  try {
    const presets = await TinymceToolbarPresets.findAll({
      order: [['is_system', 'DESC'], ['name', 'ASC']]
    });

    res.json(presets);
  } catch (error) {
    console.error('Error fetching toolbar presets:', error);
    res.status(500).json({ error: 'Failed to fetch toolbar presets' });
  }
};

// Get allowed tags for profile
const getAllowedTags = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const profile = await TinymceSettings.findByPk(id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check access permissions
    if (!profile.canBeAccessedBy(user)) {
      return res.status(403).json({ error: 'Access denied to this profile' });
    }

    const allowedTags = await TinymceAllowedTags.getTagsForProfile(id);

    res.json(allowedTags);
  } catch (error) {
    console.error('Error fetching allowed tags:', error);
    res.status(500).json({ error: 'Failed to fetch allowed tags' });
  }
};

// Update allowed tags
const updateAllowedTags = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const { tags } = req.body;

    if (!Array.isArray(tags)) {
      return res.status(400).json({ error: 'Tags must be an array' });
    }

    const profile = await TinymceSettings.findByPk(id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check permissions
    if (profile.profileType === 'system' && user.role !== 'superuser') {
      return res.status(403).json({ error: 'Only superusers can modify system profiles' });
    }

    if (profile.createdBy !== user.id && user.role !== 'admin' && user.role !== 'superuser') {
      return res.status(403).json({ error: 'You can only edit your own profiles' });
    }

    const allowedTags = await TinymceAllowedTags.bulkCreateForProfile(id, tags);

    res.json(allowedTags);
  } catch (error) {
    console.error('Error updating allowed tags:', error);
    res.status(500).json({ error: 'Failed to update allowed tags' });
  }
};

// Get feature flags
const getFeatureFlags = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const profile = await TinymceSettings.findByPk(id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check access permissions
    if (!profile.canBeAccessedBy(user)) {
      return res.status(403).json({ error: 'Access denied to this profile' });
    }

    const features = await TinymceFeatureFlags.getFeaturesForProfile(id);

    res.json(features);
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    res.status(500).json({ error: 'Failed to fetch feature flags' });
  }
};

// Update feature flags
const updateFeatureFlags = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const { features } = req.body;

    if (!Array.isArray(features)) {
      return res.status(400).json({ error: 'Features must be an array' });
    }

    const profile = await TinymceSettings.findByPk(id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check permissions
    if (profile.profileType === 'system' && user.role !== 'superuser') {
      return res.status(403).json({ error: 'Only superusers can modify system profiles' });
    }

    if (profile.createdBy !== user.id && user.role !== 'admin' && user.role !== 'superuser') {
      return res.status(403).json({ error: 'You can only edit your own profiles' });
    }

    // Update each feature flag
    const updatedFeatures = [];
    for (const featureUpdate of features) {
      const { feature_name, enabled, config } = featureUpdate;

      // Prevent disabling pagebreak
      if (feature_name === 'pagebreak' && enabled === false) {
        continue; // Skip this update
      }

      const feature = await TinymceFeatureFlags.findOne({
        where: {
          profile_id: id,
          feature_name
        }
      });

      if (feature) {
        await feature.update({ enabled, config: config || feature.config });
        updatedFeatures.push(feature);
      } else {
        const newFeature = await TinymceFeatureFlags.create({
          profile_id: id,
          feature_name,
          enabled,
          config: config || {}
        });
        updatedFeatures.push(newFeature);
      }
    }

    res.json(updatedFeatures);
  } catch (error) {
    console.error('Error updating feature flags:', error);
    res.status(500).json({ error: 'Failed to update feature flags' });
  }
};

module.exports = {
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
};