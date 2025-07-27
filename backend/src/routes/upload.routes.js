const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { protect } = require('../middleware/auth.middleware');

// Sanitize filename function
function sanitizeFileName(filename) {
  // Get file extension
  const ext = path.extname(filename).toLowerCase();
  // Get filename without extension
  let name = path.basename(filename, ext);
  
  // Convert to lowercase
  name = name.toLowerCase();
  
  // Replace spaces with hyphens
  name = name.replace(/\s+/g, '-');
  
  // Remove special characters, keep only alphanumeric and hyphens
  name = name.replace(/[^a-z0-9-]/g, '');
  
  // Remove multiple consecutive hyphens
  name = name.replace(/-+/g, '-');
  
  // Remove leading and trailing hyphens
  name = name.replace(/^-+|-+$/g, '');
  
  // If name is empty after sanitization, use a default
  if (!name) {
    name = 'image';
  }
  
  // Ensure name isn't too long (max 50 chars)
  if (name.length > 50) {
    name = name.substring(0, 50);
  }
  
  return name + ext;
}

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../../uploads/images');
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize the original filename
    const sanitized = sanitizeFileName(file.originalname);
    
    // Extract name and extension from sanitized filename
    const ext = path.extname(sanitized);
    const name = path.basename(sanitized, ext);
    
    // Add timestamp for uniqueness
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E6);
    
    // Create final filename: sanitized-name-timestamp-random.ext
    const finalName = `${name}-${timestamp}-${random}${ext}`;
    
    cb(null, finalName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload image endpoint
router.post('/image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Log the filename transformation
    console.log('Original filename:', req.file.originalname);
    console.log('Sanitized filename:', req.file.filename);

    // Construct the URL for the uploaded image
    const imageUrl = `/uploads/images/${req.file.filename}`;
    
    res.json({
      message: 'Image uploaded successfully',
      url: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete image endpoint (optional)
router.delete('/image/:filename', protect, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);
    
    // Check if file exists
    await fs.access(filePath);
    
    // Delete the file
    await fs.unlink(filePath);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Image deletion error:', error);
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;