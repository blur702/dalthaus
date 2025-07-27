import React, { useState } from 'react';
import {
  Alert as MuiAlert,
  AlertProps as MuiAlertProps,
  AlertTitle,
  Collapse,
  IconButton,
  Snackbar,
  SnackbarProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close, CheckCircle, Error, Warning, Info } from '@mui/icons-material';

export interface AlertProps extends Omit<MuiAlertProps, 'onClose'> {
  title?: string;
  dismissible?: boolean;
  autoHideDuration?: number;
  onClose?: () => void;
  variant?: 'standard' | 'filled' | 'outlined';
  showIcon?: boolean;
  collapsible?: boolean;
  snackbar?: boolean;
  snackbarProps?: Omit<SnackbarProps, 'open' | 'onClose' | 'children'>;
}

const StyledAlert = styled(MuiAlert)(({ theme, severity }) => ({
  borderRadius: theme.shape.borderRadius,
  '&.MuiAlert-filled': {
    fontWeight: 500,
  },
  '&.MuiAlert-outlined': {
    backgroundColor: 'transparent',
  },
  ...(severity === 'success' && {
    '& .MuiAlert-icon': {
      color: theme.palette.success.main,
    },
  }),
  ...(severity === 'error' && {
    '& .MuiAlert-icon': {
      color: theme.palette.error.main,
    },
  }),
  ...(severity === 'warning' && {
    '& .MuiAlert-icon': {
      color: theme.palette.warning.main,
    },
  }),
  ...(severity === 'info' && {
    '& .MuiAlert-icon': {
      color: theme.palette.info.main,
    },
  }),
}));

const severityIcons: Record<string, React.ReactNode> = {
  success: <CheckCircle />,
  error: <Error />,
  warning: <Warning />,
  info: <Info />,
};

const Alert: React.FC<AlertProps> = ({
  title,
  children,
  dismissible = false,
  autoHideDuration,
  onClose,
  severity = 'info',
  variant = 'standard',
  showIcon = true,
  collapsible = false,
  snackbar = false,
  snackbarProps = {},
  ...alertProps
}) => {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  React.useEffect(() => {
    if (autoHideDuration && !snackbar) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, snackbar]);

  const alertContent = (
    <StyledAlert
      severity={severity}
      variant={variant}
      icon={showIcon ? severityIcons[severity] : false}
      action={
        dismissible || collapsible ? (
          <>
            {collapsible && (
              <IconButton
                aria-label="toggle"
                color="inherit"
                size="small"
                onClick={handleToggleExpand}
              >
                <span style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
              </IconButton>
            )}
            {dismissible && (
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleClose}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
          </>
        ) : undefined
      }
      {...alertProps}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {collapsible ? (
        <Collapse in={expanded}>
          {children}
        </Collapse>
      ) : (
        children
      )}
    </StyledAlert>
  );

  if (snackbar) {
    return (
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration || 6000}
        onClose={handleClose}
        {...snackbarProps}
      >
        {alertContent}
      </Snackbar>
    );
  }

  return (
    <Collapse in={open}>
      {alertContent}
    </Collapse>
  );
};

export default Alert;

// Alert variants for common use cases
export const SuccessAlert: React.FC<Omit<AlertProps, 'severity'>> = (props) => (
  <Alert severity="success" {...props} />
);

export const ErrorAlert: React.FC<Omit<AlertProps, 'severity'>> = (props) => (
  <Alert severity="error" {...props} />
);

export const WarningAlert: React.FC<Omit<AlertProps, 'severity'>> = (props) => (
  <Alert severity="warning" {...props} />
);

export const InfoAlert: React.FC<Omit<AlertProps, 'severity'>> = (props) => (
  <Alert severity="info" {...props} />
);

// Preset alert configurations
export const AlertPresets = {
  successMessage: (message: string, title?: string): AlertProps => ({
    severity: 'success',
    title,
    children: message,
    dismissible: true,
    variant: 'filled',
  }),

  errorMessage: (message: string, title?: string): AlertProps => ({
    severity: 'error',
    title,
    children: message,
    dismissible: true,
    variant: 'filled',
  }),

  warningMessage: (message: string, title?: string): AlertProps => ({
    severity: 'warning',
    title,
    children: message,
    dismissible: true,
    variant: 'standard',
  }),

  infoMessage: (message: string, title?: string): AlertProps => ({
    severity: 'info',
    title,
    children: message,
    dismissible: true,
    variant: 'standard',
  }),

  notification: (message: string, severity: MuiAlertProps['severity'] = 'info'): AlertProps => ({
    severity,
    children: message,
    snackbar: true,
    dismissible: true,
    autoHideDuration: 5000,
  }),
};