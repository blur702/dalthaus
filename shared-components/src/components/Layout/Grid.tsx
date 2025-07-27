import React from 'react';
import { Grid as MuiGrid, GridProps as MuiGridProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface GridProps extends MuiGridProps {
  variant?: 'default' | 'masonry' | 'auto-fit';
  minItemWidth?: string | number;
  gap?: number;
}

const StyledGrid = styled(MuiGrid)<{
  variant?: string;
  minItemWidth?: string | number;
  gap?: number;
}>(({ theme, variant, minItemWidth, gap }) => ({
  ...(variant === 'masonry' && {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: theme.spacing(gap || 2),
  }),
  ...(variant === 'auto-fit' && minItemWidth && {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${
      typeof minItemWidth === 'number' ? `${minItemWidth}px` : minItemWidth
    }, 1fr))`,
    gap: theme.spacing(gap || 2),
  }),
}));

const Grid: React.FC<GridProps> = ({
  variant = 'default',
  minItemWidth,
  gap,
  children,
  ...props
}) => {
  if (variant === 'default') {
    return (
      <MuiGrid container spacing={gap || 2} {...props}>
        {children}
      </MuiGrid>
    );
  }

  return (
    <StyledGrid
      variant={variant}
      minItemWidth={minItemWidth}
      gap={gap}
      {...props}
    >
      {children}
    </StyledGrid>
  );
};

export default Grid;

// Grid Item component for consistency
export const GridItem: React.FC<MuiGridProps> = ({ children, ...props }) => (
  <MuiGrid item {...props}>
    {children}
  </MuiGrid>
);

// Preset grids for common use cases
export const ResponsiveGrid: React.FC<{ children: React.ReactNode; columns?: number }> = ({ 
  children, 
  columns = 3 
}) => {
  const getBreakpoints = () => {
    switch (columns) {
      case 2:
        return { xs: 12, sm: 6 };
      case 3:
        return { xs: 12, sm: 6, md: 4 };
      case 4:
        return { xs: 12, sm: 6, md: 3 };
      case 6:
        return { xs: 12, sm: 6, md: 4, lg: 2 };
      default:
        return { xs: 12, sm: 6, md: 4 };
    }
  };

  return (
    <Grid container spacing={3}>
      {React.Children.map(children, (child, index) => (
        <GridItem key={index} {...getBreakpoints()}>
          {child}
        </GridItem>
      ))}
    </Grid>
  );
};

export const MasonryGrid: React.FC<{ children: React.ReactNode; minWidth?: number }> = ({ 
  children, 
  minWidth = 300 
}) => (
  <Grid variant="masonry" minItemWidth={minWidth}>
    {children}
  </Grid>
);

export const AutoFitGrid: React.FC<{ 
  children: React.ReactNode; 
  minWidth?: number;
  gap?: number;
}> = ({ 
  children, 
  minWidth = 250,
  gap = 2
}) => (
  <Grid variant="auto-fit" minItemWidth={minWidth} gap={gap}>
    {children}
  </Grid>
);

export const CenteredGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Grid container spacing={3} justifyContent="center" alignItems="center">
    {children}
  </Grid>
);