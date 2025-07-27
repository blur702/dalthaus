import React from 'react';
import {
  CircularProgress,
  CircularProgressProps,
  Box,
  Typography,
  LinearProgress,
  LinearProgressProps,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large' | number;
  color?: CircularProgressProps['color'];
  label?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  variant?: 'circular' | 'linear' | 'dots' | 'pulse';
  thickness?: number;
  showPercentage?: boolean;
  value?: number;
  linearProps?: LinearProgressProps;
}

const SpinnerContainer = styled(Box)<{ fullScreen?: boolean; overlay?: boolean }>(
  ({ theme, fullScreen, overlay }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    ...(fullScreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: theme.zIndex.modal,
    }),
    ...(overlay && {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(2px)',
    }),
  })
);

const DotsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

const Dot = styled(Box)<{ delay: number }>(({ theme, delay }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  animation: `${pulse} 1.5s ease-in-out ${delay}s infinite`,
}));

const PulseBox = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  animation: `${pulse} 2s ease-in-out infinite`,
}));

const getSizeValue = (size: 'small' | 'medium' | 'large' | number): number => {
  if (typeof size === 'number') return size;
  
  switch (size) {
    case 'small':
      return 24;
    case 'medium':
      return 40;
    case 'large':
      return 56;
    default:
      return 40;
  }
};

const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  label,
  fullScreen = false,
  overlay = false,
  variant = 'circular',
  thickness = 3.6,
  showPercentage = false,
  value,
  linearProps = {},
}) => {
  const sizeValue = getSizeValue(size);
  
  const renderSpinner = () => {
    switch (variant) {
      case 'linear':
        return (
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <LinearProgress
              color={color}
              variant={value !== undefined ? 'determinate' : 'indeterminate'}
              value={value}
              {...linearProps}
            />
            {showPercentage && value !== undefined && (
              <Box sx={{ minWidth: 35, ml: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {`${Math.round(value)}%`}
                </Typography>
              </Box>
            )}
          </Box>
        );
      
      case 'dots':
        return (
          <DotsContainer>
            <Dot delay={0} />
            <Dot delay={0.2} />
            <Dot delay={0.4} />
          </DotsContainer>
        );
      
      case 'pulse':
        return <PulseBox />;
      
      case 'circular':
      default:
        return (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              size={sizeValue}
              color={color}
              thickness={thickness}
              variant={value !== undefined ? 'determinate' : 'indeterminate'}
              value={value}
            />
            {showPercentage && value !== undefined && (
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  sx={{ fontSize: sizeValue * 0.3 }}
                >
                  {`${Math.round(value)}%`}
                </Typography>
              </Box>
            )}
          </Box>
        );
    }
  };

  return (
    <SpinnerContainer fullScreen={fullScreen} overlay={overlay}>
      {renderSpinner()}
      {label && (
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      )}
    </SpinnerContainer>
  );
};

export default Spinner;

// Preset spinners for common use cases
export const LoadingSpinner: React.FC<Omit<SpinnerProps, 'label'>> = (props) => (
  <Spinner label="Loading..." {...props} />
);

export const SavingSpinner: React.FC<Omit<SpinnerProps, 'label'>> = (props) => (
  <Spinner label="Saving..." {...props} />
);

export const ProcessingSpinner: React.FC<Omit<SpinnerProps, 'label'>> = (props) => (
  <Spinner label="Processing..." {...props} />
);

export const FullScreenLoader: React.FC<{ label?: string }> = ({ label = "Loading..." }) => (
  <Spinner fullScreen overlay label={label} size="large" />
);