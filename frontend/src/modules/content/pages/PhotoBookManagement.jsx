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
  Tooltip,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PublicIcon from '@mui/icons-material/Public';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import ReorderIcon from '@mui/icons-material/Reorder';
import AdminLayout from '../../../components/AdminLayout';
import ContentEditor from '../components/ContentEditor';
import { photoBookService } from '../services/contentService';
import { useNavigate } from 'react-router-dom';

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

const ThumbnailAvatar = styled(Avatar)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: theme.shape.borderRadius,
}));

const PhotoBookManagement = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [photoBooks, setPhotoBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedPhotoBook, setSelectedPhotoBook] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    loadPhotoBooks();

    // Cleanup function to clear timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const loadPhotoBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await photoBookService.getAll();
      setPhotoBooks(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load photo books');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPhotoBook(null);
    setShowEditor(true);
  };

  const handleEdit = (photoBook) => {
    setSelectedPhotoBook(photoBook);
    setShowEditor(true);
  };

  const handleSave = async (photoBookData) => {
    try {
      if (selectedPhotoBook) {
        await photoBookService.update(selectedPhotoBook.id, photoBookData);
        setSuccessMessage('Photo book updated successfully');
      } else {
        await photoBookService.create(photoBookData);
        setSuccessMessage('Photo book created successfully');
      }

      setShowEditor(false);
      loadPhotoBooks();

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save photo book');
    }
  };

  const handleDelete = (photoBook) => {
    setDeleteConfirm(photoBook);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await photoBookService.delete(deleteConfirm.id);
      setSuccessMessage('Photo book deleted successfully');
      setDeleteConfirm(null);
      loadPhotoBooks();

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete photo book');
    }
  };

  if (showEditor) {
    return (
      <AdminLayout setIsAuthenticated={setIsAuthenticated}>
        <Container maxWidth="lg">
          <Box sx={{ py: 3 }}>
            <ContentEditor
              content={selectedPhotoBook}
              contentType="photoBook"
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
              Photo Book Management
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
              >
                Create New Photo Book
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ReorderIcon />}
                onClick={() => navigate('/admin/photo-books/order')}
              >
                Reorder Photo Books
              </Button>
            </Stack>
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
          ) : photoBooks.length === 0 ? (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No photo books found
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} elevation={1}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>Slug</StyledTableCell>
                    <StyledTableCell>Cover Image</StyledTableCell>
                    <StyledTableCell align="center">Photo Count</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Author</StyledTableCell>
                    <StyledTableCell>Updated</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {photoBooks.map((photoBook) => (
                    <TableRow 
                      key={photoBook.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      hover
                    >
                      <TableCell>{photoBook.title}</TableCell>
                      <TableCell>
                        <SlugText>{photoBook.slug}</SlugText>
                      </TableCell>
                      <TableCell>
                        {photoBook.coverImage ? (
                          <ThumbnailAvatar
                            src={photoBook.coverImage}
                            alt="Cover"
                            variant="square"
                          />
                        ) : (
                          <ThumbnailAvatar variant="square">
                            <ImageIcon />
                          </ThumbnailAvatar>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={photoBook.photoCount || 0} 
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <StatusChip 
                          label={photoBook.status} 
                          status={photoBook.status}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{photoBook.author?.username || 'Unknown'}</TableCell>
                      <TableCell>{new Date(photoBook.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Preview">
                            <IconButton
                              onClick={() => window.open(`/preview/photo-book/${photoBook.id}`, '_blank')}
                              color="primary"
                              size="small"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {photoBook.status === 'published' && (
                            <Tooltip title="View on public site">
                              <IconButton
                                onClick={() => window.open(`/photobooks/${photoBook.slug}`, '_blank')}
                                color="primary"
                                size="small"
                              >
                                <PublicIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleEdit(photoBook)}
                              color="primary"
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDelete(photoBook)}
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
                Are you sure you want to delete the photo book <strong>"{deleteConfirm?.title}"</strong>?
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
                Delete Photo Book
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default PhotoBookManagement;