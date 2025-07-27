import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PublicIcon from '@mui/icons-material/Public';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';
import AdminLayout from '../../../components/AdminLayout';
import ContentEditor from '../components/ContentEditor';
import { pageService } from '../services/contentService';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: theme.palette.grey[100],
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const statusColors = {
    draft: theme.palette.warning.main,
    published: theme.palette.success.main,
    archived: theme.palette.grey[600],
  };
  
  return {
    backgroundColor: statusColors[status] || theme.palette.grey[500],
    color: theme.palette.common.white,
    fontWeight: 600,
  };
});

const SlugText = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

const PageManagement = ({ setIsAuthenticated }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    loadPages();

    // Cleanup function to clear timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await pageService.getAll();
      setPages(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPage(null);
    setShowEditor(true);
  };

  const handleEdit = (page) => {
    setSelectedPage(page);
    setShowEditor(true);
  };

  const handleSave = async (pageData) => {
    try {
      if (selectedPage) {
        await pageService.update(selectedPage.id, pageData);
        setSuccessMessage('Page updated successfully');
      } else {
        await pageService.create(pageData);
        setSuccessMessage('Page created successfully');
      }

      setShowEditor(false);
      loadPages();

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save page');
    }
  };

  const handleDelete = (page) => {
    setDeleteConfirm(page);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await pageService.delete(deleteConfirm.id);
      setSuccessMessage('Page deleted successfully');
      setDeleteConfirm(null);
      loadPages();

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete page');
    }
  };

  if (showEditor) {
    return (
      <AdminLayout setIsAuthenticated={setIsAuthenticated}>
        <Container maxWidth="lg">
          <Box sx={{ py: 3 }}>
            <ContentEditor
              content={selectedPage}
              contentType="page"
              onSave={handleSave}
              onCancel={() => setShowEditor(false)}
            />
          </Box>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center" 
            sx={{ mb: 3 }}
          >
            <Typography variant="h4" component="h2">
              Page Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Create New Page
            </Button>
          </Stack>

          {error && (
            <Alert 
              severity="error" 
              onClose={() => setError('')}
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <Snackbar
            open={!!successMessage}
            autoHideDuration={3000}
            onClose={() => setSuccessMessage('')}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={() => setSuccessMessage('')} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <CircularProgress />
            </Box>
          ) : pages.length === 0 ? (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No pages found
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} elevation={1}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>Slug</StyledTableCell>
                    <StyledTableCell>Template</StyledTableCell>
                    <StyledTableCell align="center">Show in Menu</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Author</StyledTableCell>
                    <StyledTableCell>Updated</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow 
                      key={page.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      hover
                    >
                      <TableCell>{page.title}</TableCell>
                      <TableCell>
                        <SlugText>{page.slug}</SlugText>
                      </TableCell>
                      <TableCell>{page.template || 'default'}</TableCell>
                      <TableCell align="center">
                        {page.showInMenu ? (
                          <CheckIcon color="success" fontSize="small" />
                        ) : (
                          <RemoveIcon color="disabled" fontSize="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusChip 
                          label={page.status} 
                          status={page.status}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{page.author?.username || 'Unknown'}</TableCell>
                      <TableCell>{new Date(page.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Preview">
                            <IconButton
                              onClick={() => window.open(`/preview/page/${page.id}`, '_blank')}
                              color="primary"
                              size="small"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {page.status === 'published' && (
                            <Tooltip title="View on public site">
                              <IconButton
                                onClick={() => window.open(`/pages/${page.slug}`, '_blank')}
                                color="primary"
                                size="small"
                              >
                                <PublicIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleEdit(page)}
                              color="primary"
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDelete(page)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Dialog
            open={!!deleteConfirm}
            onClose={() => setDeleteConfirm(null)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the page <strong>"{deleteConfirm?.title}"</strong>?
              </DialogContentText>
              <Alert severity="warning" sx={{ mt: 2 }}>
                This action cannot be undone.
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete} 
                color="error" 
                variant="contained"
              >
                Delete Page
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default PageManagement;