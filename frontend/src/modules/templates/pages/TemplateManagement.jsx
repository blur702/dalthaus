import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as CloneIcon,
  CheckCircle as ActiveIcon,
  Build as BuildIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/AdminLayout';
import templateService from '../services/templateService';

const TemplateManagement = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, template: null });
  const [activateDialog, setActivateDialog] = useState({ open: false, template: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const result = await templateService.getAllTemplates();
      if (result.success) {
        setTemplates(result.templates || []);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load templates',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    navigate('/admin/templates/builder');
  };

  const handleEditTemplate = (templateId) => {
    navigate(`/admin/templates/builder/${templateId}`);
  };

  const handleCloneTemplate = async (templateId) => {
    try {
      const result = await templateService.cloneTemplate(templateId);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Template cloned successfully!',
          severity: 'success'
        });
        loadTemplates();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to clone template',
        severity: 'error'
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await templateService.deleteTemplate(deleteDialog.template.id);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Template deleted successfully!',
          severity: 'success'
        });
        loadTemplates();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to delete template',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, template: null });
    }
  };

  const handleActivateConfirm = async () => {
    try {
      const result = await templateService.updateTemplate(activateDialog.template.id, {
        is_active: true
      });
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Template activated successfully!',
          severity: 'success'
        });
        loadTemplates();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to activate template',
        severity: 'error'
      });
    } finally {
      setActivateDialog({ open: false, template: null });
    }
  };

  const getTemplateTypeLabel = (type) => {
    const typeLabels = {
      'front_page': 'Front Page',
      'content_page': 'Content Page',
      'archive_page': 'Archive Page',
      'custom': 'Custom'
    };
    return typeLabels[type] || type;
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Template Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateTemplate}
          >
            Create New Template
          </Button>
        </Box>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {templates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          No templates found. Create your first template to get started.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>
                          <Typography variant="subtitle2">{template.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Slug: {template.slug}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getTemplateTypeLabel(template.type)} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 300 }}>
                            {template.description || 'No description'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {template.is_active ? (
                            <Chip 
                              icon={<ActiveIcon />}
                              label="Active" 
                              size="small" 
                              color="success"
                            />
                          ) : (
                            <Chip 
                              label="Inactive" 
                              size="small" 
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditTemplate(template.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Template Builder">
                            <IconButton 
                              size="small" 
                              onClick={() => navigate(`/admin/templates/builder/${template.id}`)}
                            >
                              <BuildIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Clone">
                            <IconButton 
                              size="small" 
                              onClick={() => handleCloneTemplate(template.id)}
                            >
                              <CloneIcon />
                            </IconButton>
                          </Tooltip>
                          {!template.is_active && (
                            <Tooltip title="Activate">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => setActivateDialog({ open: true, template })}
                              >
                                <ActiveIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => setDeleteDialog({ open: true, template })}
                              disabled={template.is_active}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, template: null })}>
          <DialogTitle>Delete Template</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the template "{deleteDialog.template?.name}"? 
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, template: null })}>
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Activate Confirmation Dialog */}
        <Dialog open={activateDialog.open} onClose={() => setActivateDialog({ open: false, template: null })}>
          <DialogTitle>Activate Template</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to activate the template "{activateDialog.template?.name}"? 
              This will deactivate any other template of the same type.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActivateDialog({ open: false, template: null })}>
              Cancel
            </Button>
            <Button onClick={handleActivateConfirm} color="primary" variant="contained">
              Activate
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  );
};

export default TemplateManagement;