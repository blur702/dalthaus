import api from '../../../services/api';

const settingsService = {
  // Get global settings
  async getGlobalSettings() {
    try {
      const response = await api.get('/settings/global');
      return response.data;
    } catch (error) {
      console.error('Error fetching global settings:', error);
      throw error;
    }
  },

  // Update global settings
  async updateGlobalSettings(settings) {
    try {
      const response = await api.put('/settings/global', { settings });
      return response.data;
    } catch (error) {
      console.error('Error updating global settings:', error);
      throw error;
    }
  },

  // Reset global settings to defaults
  async resetGlobalSettings() {
    try {
      const response = await api.post('/settings/global/reset');
      return response.data;
    } catch (error) {
      console.error('Error resetting global settings:', error);
      throw error;
    }
  },

  // Export global settings
  async exportGlobalSettings() {
    try {
      const response = await api.get('/settings/global/export');
      return response.data;
    } catch (error) {
      console.error('Error exporting global settings:', error);
      throw error;
    }
  },

  // Import global settings
  async importGlobalSettings(settings) {
    try {
      const response = await api.post('/settings/global/import', { settings });
      return response.data;
    } catch (error) {
      console.error('Error importing global settings:', error);
      throw error;
    }
  }
};

export default settingsService;