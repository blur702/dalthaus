const express = require('express');
const {
  getSettings,
  getSetting,
  getDefaultSetting,
  createSetting,
  updateSetting,
  duplicateSetting,
  deleteSetting,
  exportSetting,
  importSetting
} = require('../controllers/tinymceSettings.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect, isAdmin);

router.get('/', getSettings);
router.get('/default', getDefaultSetting);
router.get('/:id', getSetting);
router.get('/:id/export', exportSetting);

router.post('/', createSetting);
router.post('/:id/duplicate', duplicateSetting);
router.post('/import', importSetting);

router.put('/:id', updateSetting);

router.delete('/:id', deleteSetting);

module.exports = router;