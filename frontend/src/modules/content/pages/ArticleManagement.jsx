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
import AdminLayout from '../../../components/AdminLayout';
import ContentEditor from '../components/ContentEditor';
import { articleService } from '../services/contentService';

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

const NoContentBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
}));

const ArticleManagement = ({ setIsAuthenticated }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    loadArticles();

    // Cleanup function to clear timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await articleService.getAll();
      setArticles(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedArticle(null);
    setShowEditor(true);
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setShowEditor(true);
  };

  const handleSave = async (articleData) => {
    try {
      if (selectedArticle) {
        await articleService.update(selectedArticle.id, articleData);
        setSuccessMessage('Article updated successfully');
      } else {
        await articleService.create(articleData);
        setSuccessMessage('Article created successfully');
      }

      setShowEditor(false);
      loadArticles();

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save article');
    }
  };

  const handleDelete = (article) => {
    setDeleteConfirm(article);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await articleService.delete(deleteConfirm.id);
      setSuccessMessage('Article deleted successfully');
      setDeleteConfirm(null);
      loadArticles();

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete article');
    }
  };

  if (showEditor) {
    return (
      <AdminLayout setIsAuthenticated={setIsAuthenticated}>
        <Container maxWidth="lg">
          <Box sx={{ py: 3 }}>
            <ContentEditor
              content={selectedArticle}
              contentType="article"
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
              Article Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Create New Article
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
          ) : articles.length === 0 ? (
            <NoContentBox>
              <Typography variant="h6" gutterBottom>
                No articles found.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Get started by creating your first article.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
                sx={{ mt: 2 }}
              >
                Create Your First Article
              </Button>
            </NoContentBox>
          ) : (
            <TableContainer component={Paper} elevation={1}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Author</StyledTableCell>
                    <StyledTableCell>Created</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow 
                      key={article.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      hover
                    >
                      <TableCell>{article.title}</TableCell>
                      <TableCell>
                        <StatusChip 
                          label={article.status} 
                          status={article.status}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{article.author?.username || 'Unknown'}</TableCell>
                      <TableCell>{new Date(article.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Preview">
                            <IconButton
                              onClick={() => window.open(`/preview/article/${article.id}`, '_blank')}
                              color="primary"
                              size="small"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {article.status === 'published' && (
                            <Tooltip title="View on public site">
                              <IconButton
                                onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                                color="primary"
                                size="small"
                              >
                                <PublicIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleEdit(article)}
                              color="primary"
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDelete(article)}
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
                Are you sure you want to delete the article <strong>"{deleteConfirm?.title}"</strong>?
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
                Delete Article
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default ArticleManagement;