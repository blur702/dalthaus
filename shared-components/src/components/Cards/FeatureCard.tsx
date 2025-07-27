import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Icon,
  CardProps,
  Button,
  CardActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowForward } from '@mui/icons-material';

export interface FeatureCardProps extends CardProps {
  icon?: React.ReactNode | string;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  description: string;
  features?: string[];
  action?: {
    label: string;
    onClick: () => void;
  };
  highlight?: boolean;
  centered?: boolean;
}

const StyledCard = styled(Card)<{ highlight?: boolean }>(({ theme, highlight }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  border: highlight ? `2px solid ${theme.palette.primary.main}` : 'none',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
  },
  '&::before': highlight ? {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  } : {},
}));

const IconWrapper = styled(Box)<{ bgcolor?: string }>(({ theme, bgcolor }) => ({
  width: 64,
  height: 64,
  borderRadius: '16px',
  backgroundColor: bgcolor || theme.palette.primary.light,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const FeatureList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& li': {
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    position: 'relative',
    listStyle: 'none',
    '&::before': {
      content: '"✓"',
      position: 'absolute',
      left: 0,
      color: theme.palette.success.main,
      fontWeight: 'bold',
    },
  },
}));

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  iconColor = 'primary.main',
  iconBgColor,
  title,
  description,
  features = [],
  action,
  highlight = false,
  centered = false,
  ...cardProps
}) => {
  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string') {
      return (
        <Icon sx={{ fontSize: 32, color: iconColor }}>
          {icon}
        </Icon>
      );
    }

    return React.cloneElement(icon as React.ReactElement, {
      sx: { fontSize: 32, color: iconColor },
    });
  };

  return (
    <StyledCard highlight={highlight} {...cardProps}>
      <CardContent 
        sx={{ 
          flexGrow: 1, 
          textAlign: centered ? 'center' : 'left',
          display: 'flex',
          flexDirection: 'column',
          alignItems: centered ? 'center' : 'flex-start',
        }}
      >
        {icon && (
          <IconWrapper bgcolor={iconBgColor}>
            {renderIcon()}
          </IconWrapper>
        )}

        <Typography 
          variant="h5" 
          component="h3" 
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          {title}
        </Typography>

        <Typography 
          variant="body1" 
          color="text.secondary" 
          paragraph
          sx={{ mb: features.length > 0 ? 1 : 2 }}
        >
          {description}
        </Typography>

        {features.length > 0 && (
          <FeatureList component="ul">
            {features.map((feature, index) => (
              <li key={index}>
                <Typography variant="body2" color="text.secondary">
                  {feature}
                </Typography>
              </li>
            ))}
          </FeatureList>
        )}
      </CardContent>

      {action && (
        <CardActions sx={{ padding: 2, pt: 0 }}>
          <Button
            fullWidth
            variant={highlight ? 'contained' : 'outlined'}
            endIcon={<ArrowForward />}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </CardActions>
      )}
    </StyledCard>
  );
};

export default FeatureCard;