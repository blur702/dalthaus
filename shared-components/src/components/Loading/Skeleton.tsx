import React from 'react';
import {
  Skeleton as MuiSkeleton,
  SkeletonProps as MuiSkeletonProps,
  Box,
  Grid,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export interface SkeletonProps extends MuiSkeletonProps {
  type?: 'text' | 'card' | 'list' | 'table' | 'form' | 'avatar' | 'image' | 'custom';
  lines?: number;
  spacing?: number;
  showAvatar?: boolean;
  showActions?: boolean;
  rows?: number;
  columns?: number;
}

const SkeletonContainer = styled(Box)(({ theme }) => ({
  width: '100%',
}));

const SkeletonCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Skeleton: React.FC<SkeletonProps> = ({
  type = 'text',
  lines = 3,
  spacing = 1,
  showAvatar = false,
  showActions = false,
  rows = 5,
  columns = 4,
  ...skeletonProps
}) => {
  const renderTextSkeleton = () => (
    <Stack spacing={spacing}>
      {Array.from({ length: lines }).map((_, index) => (
        <MuiSkeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '60%' : '100%'}
          {...skeletonProps}
        />
      ))}
    </Stack>
  );

  const renderCardSkeleton = () => (
    <SkeletonCard>
      <MuiSkeleton variant="rectangular" height={200} />
      <CardContent>
        <Stack spacing={spacing}>
          <MuiSkeleton variant="text" width="80%" height={32} />
          <MuiSkeleton variant="text" width="60%" />
          <MuiSkeleton variant="rectangular" height={60} />
          {showActions && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <MuiSkeleton variant="rectangular" width={80} height={36} />
              <MuiSkeleton variant="rectangular" width={80} height={36} />
            </Box>
          )}
        </Stack>
      </CardContent>
    </SkeletonCard>
  );

  const renderListSkeleton = () => (
    <Stack spacing={spacing}>
      {Array.from({ length: lines }).map((_, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {showAvatar && <MuiSkeleton variant="circular" width={40} height={40} />}
          <Box sx={{ flex: 1 }}>
            <MuiSkeleton variant="text" width="30%" />
            <MuiSkeleton variant="text" width="80%" />
          </Box>
          {showActions && <MuiSkeleton variant="rectangular" width={24} height={24} />}
        </Box>
      ))}
    </Stack>
  );

  const renderTableSkeleton = () => (
    <Box>
      {/* Table Header */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 1, borderBottom: 1, borderColor: 'divider' }}>
        {Array.from({ length: columns }).map((_, index) => (
          <MuiSkeleton key={index} variant="text" width={`${100 / columns}%`} height={24} />
        ))}
      </Box>
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', gap: 2, p: 1, borderBottom: 1, borderColor: 'divider' }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <MuiSkeleton key={colIndex} variant="text" width={`${100 / columns}%`} height={20} />
          ))}
        </Box>
      ))}
    </Box>
  );

  const renderFormSkeleton = () => (
    <Stack spacing={3}>
      {Array.from({ length: lines }).map((_, index) => (
        <Box key={index}>
          <MuiSkeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
          <MuiSkeleton variant="rectangular" height={56} />
        </Box>
      ))}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <MuiSkeleton variant="rectangular" width={120} height={42} />
        <MuiSkeleton variant="rectangular" width={120} height={42} />
      </Box>
    </Stack>
  );

  const renderAvatarSkeleton = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <MuiSkeleton variant="circular" width={80} height={80} />
      <Box>
        <MuiSkeleton variant="text" width={150} height={24} />
        <MuiSkeleton variant="text" width={200} />
      </Box>
    </Box>
  );

  const renderImageSkeleton = () => (
    <MuiSkeleton variant="rectangular" width="100%" height={400} {...skeletonProps} />
  );

  switch (type) {
    case 'card':
      return renderCardSkeleton();
    case 'list':
      return renderListSkeleton();
    case 'table':
      return renderTableSkeleton();
    case 'form':
      return renderFormSkeleton();
    case 'avatar':
      return renderAvatarSkeleton();
    case 'image':
      return renderImageSkeleton();
    case 'text':
      return renderTextSkeleton();
    case 'custom':
      return <MuiSkeleton {...skeletonProps} />;
    default:
      return renderTextSkeleton();
  }
};

export default Skeleton;

// Preset skeleton layouts for common use cases
export const ArticleSkeleton: React.FC = () => (
  <Box>
    <Skeleton type="image" height={300} sx={{ mb: 3 }} />
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Skeleton variant="text" width="60%" height={48} sx={{ mb: 2 }} />
      <Skeleton type="text" lines={5} />
    </Box>
  </Box>
);

export const ProfileSkeleton: React.FC = () => (
  <Box>
    <Skeleton type="avatar" />
    <Box sx={{ mt: 3 }}>
      <Skeleton type="text" lines={3} />
    </Box>
  </Box>
);

export const CardGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <Grid container spacing={3}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Skeleton type="card" />
      </Grid>
    ))}
  </Grid>
);

export const DashboardSkeleton: React.FC = () => (
  <Box>
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" height={32} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    <Skeleton type="table" rows={10} columns={5} />
  </Box>
);