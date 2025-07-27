// Shared color palette configuration
export const palette = {
  // Primary colors - Navy Blue theme
  primary: {
    main: '#2c3e50',
    light: '#34495e',
    dark: '#1a252f',
    contrastText: '#ffffff',
  },
  
  // Secondary colors - Green accent
  secondary: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    contrastText: '#ffffff',
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
    default: '#f5f5f5',
    paper: '#ffffff',
    dark: '#2c3e50',
    darker: '#1a252f',
  },
  
  // Text colors
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
    disabled: '#95a5a6',
    hint: '#95a5a6',
    light: '#ffffff',
  },
  
  // Action colors
  action: {
    active: '#2c3e50',
    hover: 'rgba(44, 62, 80, 0.08)',
    selected: 'rgba(44, 62, 80, 0.12)',
    disabled: 'rgba(44, 62, 80, 0.26)',
    disabledBackground: 'rgba(44, 62, 80, 0.12)',
  },
  
  // Divider and border colors
  divider: '#e0e0e0',
  border: {
    light: '#e0e0e0',
    main: '#ddd',
    dark: '#bdbdbd',
  },
  
  // Additional UI colors
  ui: {
    footer: '#34495e',
    header: '#2c3e50',
    sidebar: '#2c3e50',
    hover: '#f8f9fa',
    selected: '#e3f2fd',
  },
};

// Typography color variants
export const typographyColors = {
  heading: palette.text.primary,
  body: palette.text.primary,
  muted: palette.text.secondary,
  disabled: palette.text.disabled,
  inverse: palette.text.light,
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