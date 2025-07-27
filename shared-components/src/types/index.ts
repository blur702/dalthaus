// Common type definitions for the shared component library

import { ReactNode } from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  'data-testid'?: string;
}

// Common variant types
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type AlertSeverity = 'error' | 'warning' | 'info' | 'success';
export type Size = 'small' | 'medium' | 'large';
export type Color = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit' | 'default';

// Form-related types
export interface FormFieldProps {
  name: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

// Layout types
export interface LayoutProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Spacing types
export type Spacing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Breakpoint types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Grid column spans
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | true | false;

// Common event handlers
export interface CommonEventHandlers {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLElement>) => void;
}

// Theme-related types
export interface ThemeColors {
  primary: string;
  secondary: string;
  error: string;
  warning: string;
  info: string;
  success: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  background: {
    default: string;
    paper: string;
  };
}

// Component state types
export interface LoadingState {
  loading: boolean;
  error?: string | null;
  success?: boolean;
}

// Pagination types
export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

// Sort types
export type SortDirection = 'asc' | 'desc';
export interface SortConfig {
  field: string;
  direction: SortDirection;
}

// Filter types
export interface FilterOption {
  value: string | number;
  label: string;
  count?: number;
}

export interface Filter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between';
  value: any;
}

// Table types
export interface TableColumn<T = any> {
  field: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => ReactNode;
}

// Navigation types
export interface NavigationItem {
  label: string;
  path?: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  badge?: string | number;
  disabled?: boolean;
}

// Upload types
export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onUpload: (files: File[]) => void;
  onError?: (error: string) => void;
}

// Notification types
export interface NotificationProps {
  id: string;
  type: AlertSeverity;
  title?: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

// Export all component prop types
export * from '../components/Alerts/Alert';
export * from '../components/Buttons/Button';
export * from '../components/Cards/ContentCard';
export * from '../components/Cards/FeatureCard';
export * from '../components/Forms/TextField';
export * from '../components/Forms/Select';
export * from '../components/Loading/Spinner';
export * from '../components/Loading/Skeleton';
export * from '../components/Modals/Modal';
export * from '../components/Modals/Dialog';
export * from '../components/Layout/Container';
export * from '../components/Layout/Grid';
export * from '../components/Layout/Stack';