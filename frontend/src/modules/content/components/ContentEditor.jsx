import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Chip,
  FormControlLabel,
  Checkbox,
  Grid,
  Alert,
  IconButton,
  FormHelperText,
  InputAdornment,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import RichTextEditor from '../../../components/RichTextEditor';
import DocumentUpload from '../../../components/DocumentUpload';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  '& img': {
    maxWidth: '200px',
    maxHeight: '150px',
    objectFit: 'cover',
    border: `1px solid ${theme.palette.divider}`,
    display: 'block',
  }
}));

const TagsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const ContentEditor = ({ content, contentType, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    body: '',
    status: 'draft',
    featuredImage: '',
    featuredImageAlt: '',
    summary: '',
    teaserImage: '',
    teaserImageAlt: '',
    // Article specific
    excerpt: '',
    category: '',
    tags: [],
    // Page specific
    template: 'default',
    parentId: null,
    order: 0,
    showInMenu: true,
    // PhotoBook specific
    coverImage: '',
    photoCount: 0
  });

  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData({
        ...formData,
        ...content,
        tags: content.tags || []
      });
    }
  }, [content]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSlugGeneration = () => {
    if (!formData.slug && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.body.trim()) {
      newErrors.body = 'Content body is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.url;
        setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
        console.log('Image uploaded successfully:', imageUrl);
      } else {
        console.error('Upload failed:', response.status);
        const errorData = await response.text();
        console.error('Error details:', errorData);
        alert('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTeaserImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.url;
        setFormData(prev => ({ ...prev, teaserImage: imageUrl }));
        console.log('Teaser image uploaded successfully:', imageUrl);
      } else {
        console.error('Upload failed:', response.status);
        const errorData = await response.text();
        console.error('Error details:', errorData);
        alert('Failed to upload teaser image. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload teaser image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const dataToSave = { ...formData };
      
      console.log('Submitting form data:', dataToSave);
      console.log('Featured Image URL:', dataToSave.featuredImage);
      
      // Clean up data based on content type - but keep summary and teaserImage for all types
      if (contentType === 'article') {
        delete dataToSave.template;
        delete dataToSave.parentId;
        delete dataToSave.order;
        delete dataToSave.showInMenu;
        delete dataToSave.coverImage;
        delete dataToSave.photoCount;
      } else if (contentType === 'page') {
        delete dataToSave.excerpt;
        delete dataToSave.category;
        delete dataToSave.tags;
        delete dataToSave.coverImage;
        delete dataToSave.photoCount;
      } else if (contentType === 'photoBook') {
        delete dataToSave.excerpt;
        delete dataToSave.category;
        delete dataToSave.tags;
        delete dataToSave.template;
        delete dataToSave.parentId;
        delete dataToSave.order;
        delete dataToSave.showInMenu;
        delete dataToSave.coverImage;
        delete dataToSave.photoCount;
      }
      
      console.log('Data being saved:', dataToSave);
      onSave(dataToSave);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <StyledPaper elevation={1}>
        <Typography variant="h5" component="h3" gutterBottom>
          {content ? 'Edit' : 'Create'} {contentType}
        </Typography>

        <Grid container spacing={3}>
          {/* Title - Full width on its own line */}
          <Grid size={12}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleSlugGeneration}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              required
              variant="outlined"
            />
          </Grid>

          {/* Featured Image - Full width on its own line */}
          {(contentType === 'article' || contentType === 'photoBook') && (
            <Grid size={12}>
              <TextField
                label="Featured Image"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg or upload an image"
                fullWidth
                variant="outlined"
                helperText="Main image displayed on the content detail page"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <input
                        type="file"
                        id="featuredImageFile"
                        accept="image/*"
                        onChange={handleFeaturedImageUpload}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="featuredImageFile">
                        <IconButton
                          component="span"
                          disabled={loading}
                          color="primary"
                        >
                          <UploadIcon />
                        </IconButton>
                      </label>
                      {formData.featuredImage && (
                        <IconButton
                          onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              {formData.featuredImage && (
                <ImagePreview>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Preview:
                  </Typography>
                  <img
                    src={formData.featuredImage.startsWith('http') ? formData.featuredImage : `http://localhost:5001${formData.featuredImage}`}
                    alt="Featured image preview"
                    onError={(e) => {
                      console.error('Preview image failed to load:', formData.featuredImage);
                      e.target.style.display = 'none';
                    }}
                  />
                </ImagePreview>
              )}
            </Grid>
          )}

          {/* Featured Image Alt Text */}
          {(contentType === 'article' || contentType === 'photoBook') && formData.featuredImage && (
            <Grid size={12}>
              <TextField
                label="Featured Image Alt Text"
                name="featuredImageAlt"
                value={formData.featuredImageAlt}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="Describe the featured image for accessibility"
                helperText="Alternative text for screen readers and when image cannot be displayed"
              />
            </Grid>
          )}

          {/* Summary - Full width on its own line */}
          <Grid size={12}>
            <TextField
              label="Summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              placeholder="Brief description for listing pages"
              helperText="This summary will be displayed on listing pages instead of the full content"
            />
          </Grid>

          {/* Teaser Image - Full width on its own line */}
          <Grid size={12}>
            <TextField
              label="Teaser Image"
              name="teaserImage"
              value={formData.teaserImage}
              onChange={handleChange}
              placeholder="https://example.com/teaser.jpg or upload an image"
              fullWidth
              variant="outlined"
              helperText="Image displayed on listing pages (if different from featured image)"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <input
                      type="file"
                      id="teaserImageFile"
                      accept="image/*"
                      onChange={handleTeaserImageUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="teaserImageFile">
                      <IconButton
                        component="span"
                        disabled={loading}
                        color="primary"
                      >
                        <UploadIcon />
                      </IconButton>
                    </label>
                    {formData.teaserImage && (
                      <IconButton
                        onClick={() => setFormData(prev => ({ ...prev, teaserImage: '' }))}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
            {formData.teaserImage && (
              <ImagePreview>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Teaser Preview:
                </Typography>
                <img
                  src={formData.teaserImage.startsWith('http') ? formData.teaserImage : `http://localhost:5001${formData.teaserImage}`}
                  alt="Teaser image preview"
                  onError={(e) => {
                    console.error('Teaser preview image failed to load:', formData.teaserImage);
                    e.target.style.display = 'none';
                  }}
                />
              </ImagePreview>
            )}
          </Grid>

          {/* Teaser Image Alt Text */}
          {formData.teaserImage && (
            <Grid size={12}>
              <TextField
                label="Teaser Image Alt Text"
                name="teaserImageAlt"
                value={formData.teaserImageAlt}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="Describe the teaser image for accessibility"
                helperText="Alternative text for screen readers and when image cannot be displayed"
              />
            </Grid>
          )}

          {/* URL Alias (Slug) - Full width on its own line */}
          <Grid size={12}>
            <TextField
              label="URL Alias"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="auto-generated from title"
              fullWidth
              variant="outlined"
              helperText="The URL-friendly version of the title. Leave blank to auto-generate."
            />
          </Grid>

          {contentType === 'article' && (
            <>
              <Grid size={12}>
                <TextField
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>


              <Grid size={12}>
                <TextField
                  label="Excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagAdd}
                  placeholder="Press Enter to add tag"
                  fullWidth
                  variant="outlined"
                />
                <TagsContainer>
                  {formData.tags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => removeTag(tag)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </TagsContainer>
              </Grid>
            </>
          )}

          {contentType === 'page' && (
            <>
              {/* Template - Full width on its own line */}
              <Grid size={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Template</InputLabel>
                  <Select
                    name="template"
                    value={formData.template}
                    onChange={handleChange}
                    label="Template"
                  >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="full-width">Full Width</MenuItem>
                    <MenuItem value="sidebar">With Sidebar</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Order - Full width on its own line */}
              <Grid size={12}>
                <TextField
                  label="Order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  helperText="The display order for this page in menus and lists"
                />
              </Grid>

              {/* Show in Menu - On its own line */}
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="showInMenu"
                      checked={formData.showInMenu}
                      onChange={handleChange}
                    />
                  }
                  label="Show in Menu"
                />
              </Grid>
            </>
          )}


          <Grid size={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Content *
            </Typography>
            <DocumentUpload
              onContentLoaded={(htmlContent) => {
                setFormData(prev => ({
                  ...prev,
                  body: prev.body + htmlContent
                }));
              }}
              allowedTags={['p', 'br', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
                'a', 'img', 'blockquote', 'code', 'pre', 'table', 'thead', 'tbody',
                'tfoot', 'tr', 'td', 'th', 'caption', 'sup', 'sub', 'hr']}
            />
            <Box sx={{ mt: 2 }}>
              <RichTextEditor
                value={formData.body}
                onChange={(content) => setFormData(prev => ({ ...prev, body: content }))}
                height={400}
                contentType={contentType}
              />
              {errors.body && (
                <FormHelperText error>{errors.body}</FormHelperText>
              )}
            </Box>
          </Grid>

          <Grid size={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button 
          onClick={onCancel}
          variant="outlined"
          size="large"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          variant="contained"
          color="primary"
          size="large"
        >
          {content ? 'Update' : 'Create'} {contentType}
        </Button>
      </Box>
    </Box>
  );
};

export default ContentEditor;