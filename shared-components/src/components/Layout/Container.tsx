import React from 'react';
import { Container as MuiContainer, ContainerProps as MuiContainerProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface ContainerProps extends MuiContainerProps {
  variant?: 'default' | 'narrow' | 'wide' | 'fluid';
  padding?: 'none' | 'small' | 'medium' | 'large';
  centered?: boolean;
  minHeight?: string | number;
}

const StyledContainer = styled(MuiContainer)<{
  variant?: string;
  padding?: string;
  centered?: boolean;
  minHeight?: string | number;
}>(({ theme, variant, padding, centered, minHeight }) => ({
  ...(variant === 'narrow' && {
    maxWidth: 800,
  }),
  ...(variant === 'wide' && {
    maxWidth: 1600,
  }),
  ...(variant === 'fluid' && {
    maxWidth: '100%',
  }),
  ...(padding === 'none' && {
    padding: 0,
  }),
  ...(padding === 'small' && {
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
    },
  }),
  ...(padding === 'medium' && {
    padding: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
    },
  }),
  ...(padding === 'large' && {
    padding: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(6),
    },
  }),
  ...(centered && {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  ...(minHeight && {
    minHeight,
  }),
}));

const Container: React.FC<ContainerProps> = ({
  variant = 'default',
  padding = 'medium',
  centered = false,
  minHeight,
  children,
  ...props
}) => {
  return (
    <StyledContainer
      variant={variant}
      padding={padding}
      centered={centered}
      minHeight={minHeight}
      {...props}
    >
      {children}
    </StyledContainer>
  );
};

export default Container;

// Preset containers for common use cases
export const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Container variant="default" padding="medium" minHeight="100vh">
    {children}
  </Container>
);

export const ContentContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Container variant="narrow" padding="medium">
    {children}
  </Container>
);

export const HeroContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Container variant="wide" padding="large" centered minHeight="50vh">
    {children}
  </Container>
);

export const FormContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Container variant="narrow" padding="medium" maxWidth="sm">
    {children}
  </Container>
);