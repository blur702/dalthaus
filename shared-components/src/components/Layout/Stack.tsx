import React from 'react';
import { Stack as MuiStack, StackProps as MuiStackProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface StackProps extends MuiStackProps {
  variant?: 'default' | 'responsive' | 'centered';
  gap?: number;
}

const StyledStack = styled(MuiStack)<{
  variant?: string;
  gap?: number;
}>(({ theme, variant, gap }) => ({
  gap: theme.spacing(gap || 2),
  ...(variant === 'centered' && {
    alignItems: 'center',
    justifyContent: 'center',
  }),
  ...(variant === 'responsive' && {
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  }),
}));

const Stack: React.FC<StackProps> = ({
  variant = 'default',
  gap = 2,
  children,
  ...props
}) => {
  return (
    <StyledStack
      variant={variant}
      gap={gap}
      {...props}
    >
      {children}
    </StyledStack>
  );
};

export default Stack;

// Preset stacks for common use cases
export const HorizontalStack: React.FC<{ children: React.ReactNode; gap?: number }> = ({ 
  children, 
  gap = 2 
}) => (
  <Stack direction="row" gap={gap} alignItems="center">
    {children}
  </Stack>
);

export const VerticalStack: React.FC<{ children: React.ReactNode; gap?: number }> = ({ 
  children, 
  gap = 2 
}) => (
  <Stack direction="column" gap={gap}>
    {children}
  </Stack>
);

export const ResponsiveStack: React.FC<{ children: React.ReactNode; gap?: number }> = ({ 
  children, 
  gap = 2 
}) => (
  <Stack variant="responsive" gap={gap}>
    {children}
  </Stack>
);

export const CenteredStack: React.FC<{ children: React.ReactNode; gap?: number }> = ({ 
  children, 
  gap = 2 
}) => (
  <Stack variant="centered" gap={gap}>
    {children}
  </Stack>
);

export const SpaceBetweenStack: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    {children}
  </Stack>
);

export const FormStack: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Stack direction="column" gap={3}>
    {children}
  </Stack>
);

export const ButtonStack: React.FC<{ 
  children: React.ReactNode; 
  align?: 'left' | 'right' | 'center' 
}> = ({ 
  children, 
  align = 'right' 
}) => {
  const justifyContent = align === 'left' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end';
  
  return (
    <Stack direction="row" gap={1} justifyContent={justifyContent}>
      {children}
    </Stack>
  );
};