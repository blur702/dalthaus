import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Chip,
  Stack,
  Alert,
  Grid
} from '@mui/material';
import { CheckCircle, Warning, Error } from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';

const MaterialUITest = ({ setIsAuthenticated }) => {
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Material UI Integration Test
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This page demonstrates that Material UI components are working correctly.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Theme Colors
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label="Primary" color="primary" />
                <Chip label="Secondary" color="secondary" />
                <Chip label="Success" color="success" />
                <Chip label="Error" color="error" />
                <Chip label="Warning" color="warning" />
                <Chip label="Info" color="info" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Component Status
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" />
                  <Typography>AdminLayout - Converted</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" />
                  <Typography>Header - Converted</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" />
                  <Typography>Footer - Converted</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" />
                  <Typography>Breadcrumbs - Converted</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Material UI theme is successfully integrated and all navigation components have been converted!
          </Alert>
          
          <Alert severity="info">
            The application is now using the custom Material UI theme with navy blue primary colors and green secondary colors.
          </Alert>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Theme Details
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Primary Color:</strong> #2c3e50 (Navy Blue)
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Secondary Color:</strong> #4CAF50 (Green)
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Typography:</strong> System font stack for optimal performance
              </Typography>
              <Typography variant="body2">
                <strong>Border Radius:</strong> 8px for cards, 4px for buttons
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary">
              Primary Button
            </Button>
            <Button variant="contained" color="secondary">
              Secondary Button
            </Button>
            <Button variant="outlined" color="primary">
              Outlined Button
            </Button>
            <Button variant="text" color="primary">
              Text Button
            </Button>
          </Box>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default MaterialUITest;