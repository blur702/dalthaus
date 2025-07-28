// Shared color palette configuration
export const palette = {
  // Primary colors - Greyscale theme
  primary: {
    main: '#404040',
    light: '#525252',
    dark: '#333333',
    contrastText: '#e8e8e8',
  },
  
  // Secondary colors - Greyscale accent
  secondary: {
    main: '#757575',
    light: '#a8a8a8',
    dark: '#424242',
    contrastText: '#e8e8e8',
  },
  
  // Error states
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
    contrastText: '#ffffff',
  },
  
  // Warning states
  warning: {
    main: '#ffc107',
    light: '#ffecb3',
    dark: '#ffa000',
    contrastText: '#212529',
  },
  
  // Info states
  info: {
    main: '#3498db',
    light: '#64b5f6',
    dark: '#2980b9',
    contrastText: '#ffffff',
  },
  
  // Success states
  success: {
    main: '#27ae60',
    light: '#81c784',
    dark: '#388e3c',
    contrastText: '#ffffff',
  },
  
  // Role-based colors
  roles: {
    superuser: '#e74c3c',
    admin: '#3498db',
    user: '#95a5a6',
  },
  
  // Status colors
  status: {
    draft: '#f39c12',
    published: '#27ae60',
    archived: '#95a5a6',
    active: '#27ae60',
    inactive: '#95a5a6',
  },
  
  // Background colors
  background: {
    default: '#e8e8e8',
    paper: '#e8e8e8',  // Same as default for consistent backgrounds
    dark: '#d9d9d9',
    darker: '#d0d0d0',
  },
  
  // Text colors
  text: {
    primary: '#404040',     // Darker grey (8.46:1 contrast ratio)
    secondary: '#525252',   // Medium grey (6.38:1 contrast)
    disabled: '#666666',    // Light grey for disabled text
    hint: '#666666',
    light: '#e8e8e8',       // For text on dark backgrounds
  },
  
  // Action colors
  action: {
    active: '#404040',
    hover: 'rgba(64, 64, 64, 0.08)',
    selected: 'rgba(64, 64, 64, 0.12)',
    disabled: 'rgba(64, 64, 64, 0.26)',
    disabledBackground: 'rgba(64, 64, 64, 0.12)',
  },
  
  // Divider and border colors
  divider: '#c8c8c8',
  border: {
    light: '#d0d0d0',
    main: '#c8c8c8',
    dark: '#b8b8b8',
  },
  
  // Additional UI colors
  ui: {
    footer: '#e8e8e8',
    header: '#e8e8e8',
    sidebar: '#e8e8e8',
    hover: '#d9d9d9',
    selected: '#d0d0d0',
  },
};

// Typography color variants
export const typographyColors = {
  heading: '#404040',  // Same as text.primary
  body: '#404040',
  muted: '#525252',
  disabled: '#666666',
  inverse: '#e8e8e8',
};

// Gradient definitions
export const gradients = {
  primary: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
  secondary: `linear-gradient(135deg, ${palette.secondary.main} 0%, ${palette.secondary.dark} 100%)`,
  success: `linear-gradient(135deg, ${palette.success.main} 0%, ${palette.success.dark} 100%)`,
  dark: `linear-gradient(180deg, ${palette.background.dark} 0%, ${palette.background.darker} 100%)`,
};

// Shadow definitions
export const shadows = {
  small: '0 2px 4px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
  large: '0 8px 16px rgba(0, 0, 0, 0.1)',
  hover: '0 4px 12px rgba(0, 0, 0, 0.15)',
};