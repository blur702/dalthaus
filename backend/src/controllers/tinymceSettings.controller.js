const TinymceSettings = require('../models/tinymceSettings.model');
const { Op } = require('sequelize');

const getSettings = async (req, res) => {
  try {
    const { search, tags, includePresets = true } = req.query;
    
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (tags && Array.isArray(tags)) {
      whereClause.tags = { [Op.overlap]: tags };
    }
    
    if (!includePresets || includePresets === 'false') {
      whereClause.isPreset = false;
    }
    
    const settings = await TinymceSettings.findAll({
      where: whereClause,
      order: [
        ['isDefault', 'DESC'],
        ['isPreset', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching TinyMCE settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

const getSetting = async (req, res) => {
  try {
    const { id } = req.params;
    
    const setting = await TinymceSettings.findByPk(id);
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.json(setting);
  } catch (error) {
    console.error('Error fetching TinyMCE setting:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
};

const getDefaultSetting = async (req, res) => {
  try {
    const defaultSetting = await TinymceSettings.findOne({
      where: { isDefault: true }
    });
    
    if (!defaultSetting) {
      return res.status(404).json({ error: 'No default setting found' });
    }
    
    res.json(defaultSetting);
  } catch (error) {
    console.error('Error fetching default TinyMCE setting:', error);
    res.status(500).json({ error: 'Failed to fetch default setting' });
  }
};

const createSetting = async (req, res) => {
  try {
    const { name, description, settings, isDefault, tags } = req.body;
    const userId = req.user.id;
    
    const existingSetting = await TinymceSettings.findOne({
      where: { name }
    });
    
    if (existingSetting) {
      return res.status(400).json({ error: 'A setting with this name already exists' });
    }
    
    const newSetting = await TinymceSettings.create({
      name,
      description,
      settings,
      isDefault: isDefault || false,
      tags: tags || [],
      createdBy: userId,
      updatedBy: userId,
      isPreset: false
    });
    
    res.status(201).json(newSetting);
  } catch (error) {
    console.error('Error creating TinyMCE setting:', error);
    res.status(500).json({ error: 'Failed to create setting' });
  }
};

const updateSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, settings, isDefault, tags } = req.body;
    const userId = req.user.id;
    
    const existingSetting = await TinymceSettings.findByPk(id);
    
    if (!existingSetting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    if (existingSetting.isPreset) {
      return res.status(403).json({ error: 'Cannot modify preset settings' });
    }
    
    if (name && name !== existingSetting.name) {
      const duplicateName = await TinymceSettings.findOne({
        where: { name, id: { [Op.ne]: id } }
      });
      
      if (duplicateName) {
        return res.status(400).json({ error: 'A setting with this name already exists' });
      }
    }
    
    await existingSetting.update({
      name: name || existingSetting.name,
      description: description !== undefined ? description : existingSetting.description,
      settings: settings || existingSetting.settings,
      isDefault: isDefault !== undefined ? isDefault : existingSetting.isDefault,
      tags: tags !== undefined ? tags : existingSetting.tags,
      updatedBy: userId
    });
    
    res.json(existingSetting);
  } catch (error) {
    console.error('Error updating TinyMCE setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

const duplicateSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;
    
    const originalSetting = await TinymceSettings.findByPk(id);
    
    if (!originalSetting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    const newName = name || `${originalSetting.name} (Copy)`;
    
    let uniqueName = newName;
    let counter = 1;
    while (await TinymceSettings.findOne({ where: { name: uniqueName } })) {
      uniqueName = `${newName} ${counter}`;
      counter++;
    }
    
    const duplicatedSetting = await TinymceSettings.create({
      name: uniqueName,
      description: originalSetting.description,
      settings: originalSetting.settings,
      isDefault: false,
      tags: originalSetting.tags,
      createdBy: userId,
      updatedBy: userId,
      isPreset: false
    });
    
    res.status(201).json(duplicatedSetting);
  } catch (error) {
    console.error('Error duplicating TinyMCE setting:', error);
    res.status(500).json({ error: 'Failed to duplicate setting' });
  }
};

const deleteSetting = async (req, res) => {
  try {
    const { id } = req.params;
    
    const setting = await TinymceSettings.findByPk(id);
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    if (setting.isPreset) {
      return res.status(403).json({ error: 'Cannot delete preset settings' });
    }
    
    if (setting.isDefault) {
      return res.status(400).json({ error: 'Cannot delete the default setting. Please set another setting as default first.' });
    }
    
    await setting.destroy();
    
    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting TinyMCE setting:', error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
};

const exportSetting = async (req, res) => {
  try {
    const { id } = req.params;
    
    const setting = await TinymceSettings.findByPk(id);
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    const exportData = {
      name: setting.name,
      description: setting.description,
      settings: setting.settings,
      tags: setting.tags,
      exportedAt: new Date().toISOString()
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${setting.name.replace(/[^a-z0-9]/gi, '_')}_tinymce_settings.json"`);
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting TinyMCE setting:', error);
    res.status(500).json({ error: 'Failed to export setting' });
  }
};

const importSetting = async (req, res) => {
  try {
    const { name, description, settings, tags } = req.body;
    const userId = req.user.id;
    
    if (!name || !settings) {
      return res.status(400).json({ error: 'Name and settings are required' });
    }
    
    let uniqueName = name;
    let counter = 1;
    while (await TinymceSettings.findOne({ where: { name: uniqueName } })) {
      uniqueName = `${name} (Imported ${counter})`;
      counter++;
    }
    
    const importedSetting = await TinymceSettings.create({
      name: uniqueName,
      description: description || 'Imported setting',
      settings,
      isDefault: false,
      tags: tags || [],
      createdBy: userId,
      updatedBy: userId,
      isPreset: false
    });
    
    res.status(201).json(importedSetting);
  } catch (error) {
    console.error('Error importing TinyMCE setting:', error);
    res.status(500).json({ error: 'Failed to import setting' });
  }
};

module.exports = {
  getSettings,
  getSetting,
  getDefaultSetting,
  createSetting,
  updateSetting,
  duplicateSetting,
  deleteSetting,
  exportSetting,
  importSetting
};