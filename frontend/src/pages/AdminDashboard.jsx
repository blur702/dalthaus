import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AdminLayout from '../components/AdminLayout';

const DashboardCard = styled(Card)(({ theme }) => ({
  height: '100%',
  textAlign: 'center',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const CardValue = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  margin: theme.spacing(2, 0),
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontSize: '1.5rem',
  padding: theme.spacing(3, 2),
  margin: theme.spacing(2, 0),
  fontWeight: 'bold',
}));

const ActivityList = styled(List)(({ theme }) => ({
  '& .MuiListItem-root': {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
    '&:last-child': {
      borderBottom: 'none',
    },
  },
}));

const ActivityUser = styled('span')(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginRight: theme.spacing(1),
}));

const ActivityAction = styled('span')(({ theme }) => ({
  color: theme.palette.text.primary,
  marginRight: theme.spacing(1),
}));

const ActivityTime = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  marginLeft: 'auto',
}));

const AdminDashboard = ({ setIsAuthenticated }) => {
  const dashboardData = [
    {
      title: 'Users',
      value: '5',
      label: 'Total Users',
      color: 'primary'
    },
    {
      title: 'Activity',
      value: '24',
      label: 'Actions Today',
      color: 'secondary'
    },
    {
      title: 'System Status',
      value: 'Active',
      label: 'All Systems Operational',
      isStatus: true,
      color: 'success'
    }
  ];

  const recentActivity = [
    {
      user: 'Admin',
      action: 'logged in',
      time: '2 minutes ago'
    },
    {
      user: 'System',
      action: 'backup completed',
      time: '1 hour ago'
    }
  ];

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome to the admin area! From here you can manage the application.
            </Typography>
          </Box>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {dashboardData.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <DashboardCard>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {card.title}
                    </Typography>
                    {card.isStatus ? (
                      <StatusChip 
                        label={card.value} 
                        color={card.color}
                        size="large"
                      />
                    ) : (
                      <CardValue color={card.color}>
                        {card.value}
                      </CardValue>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {card.label}
                    </Typography>
                  </CardContent>
                </DashboardCard>
              </Grid>
            ))}
          </Grid>
          
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Recent Activity
            </Typography>
            <ActivityList>
              {recentActivity.map((activity, index) => (
                <ListItem key={index}>
                  <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
                    <ActivityUser>{activity.user}</ActivityUser>
                    <ActivityAction>{activity.action}</ActivityAction>
                    <ActivityTime>{activity.time}</ActivityTime>
                  </Stack>
                </ListItem>
              ))}
            </ActivityList>
          </Paper>
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default AdminDashboard;