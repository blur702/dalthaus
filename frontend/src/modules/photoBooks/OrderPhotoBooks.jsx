import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SortableItem = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        cursor: 'move',
        boxShadow: isDragging ? 4 : 1,
        bgcolor: isDragging ? 'action.hover' : 'background.paper',
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton {...attributes} {...listeners} sx={{ cursor: 'grab' }}>
          <DragIndicatorIcon />
        </IconButton>
        
        {item.teaserImage && (
          <CardMedia
            component="img"
            sx={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 1 }}
            image={item.teaserImage}
            alt={item.teaserImageAlt || item.title}
          />
        )}
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            {item.title}
          </Typography>
          {item.summary && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {item.summary}
            </Typography>
          )}
        </Box>
        
        <Chip
          label={item.status}
          size="small"
          color={
            item.status === 'published' ? 'success' :
            item.status === 'draft' ? 'warning' : 'default'
          }
        />
      </CardContent>
    </Card>
  );
};

const OrderPhotoBooks = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchPhotoBooks();
  }, []);

  const fetchPhotoBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/content/photo-books?limit=100');
      // Sort by orderIndex initially
      const sortedItems = response.data.items.sort((a, b) => 
        (a.orderIndex || 0) - (b.orderIndex || 0)
      );
      setItems(sortedItems);
    } catch (error) {
      console.error('Error fetching photo books:', error);
      setError('Failed to load photo books');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newItems;
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Send the updated order to the backend
      const itemsWithOrder = items.map((item) => ({
        id: item.id
      }));

      await api.put('/content/photo-books/order', {
        items: itemsWithOrder
      });

      setSuccess('Photo book order saved successfully');
      setHasChanges(false);
      
      // Refresh the list to confirm the order
      await fetchPhotoBooks();
    } catch (error) {
      console.error('Error saving order:', error);
      setError('Failed to save photo book order');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/admin/photo-books')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flex: 1 }}>
          Order Photo Books
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!hasChanges || saving}
        >
          {saving ? 'Saving...' : 'Save Order'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {hasChanges && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You have unsaved changes. Click "Save Order" to apply them.
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Drag and drop photo books to reorder them. This order will be reflected on the public listing page.
        </Typography>

        {items.length === 0 ? (
          <Alert severity="info">
            No photo books found. Create some photo books first.
          </Alert>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item) => (
                <SortableItem key={item.id} item={item} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </Paper>
    </Box>
  );
};

export default OrderPhotoBooks;