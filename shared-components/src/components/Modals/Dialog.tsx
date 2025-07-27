import React from 'react';
import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material';

export interface DialogProps extends Omit<MuiDialogProps, 'children'> {
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
  actions?: React.ReactNode;
  showCloseButton?: boolean;
  disableBackdropClick?: boolean;
  responsive?: boolean;
  contentText?: string;
}

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  paddingRight: theme.spacing(6),
  position: 'relative',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.grey[500],
}));

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  subtitle,
  content,
  actions,
  showCloseButton = true,
  disableBackdropClick = false,
  responsive = true,
  contentText,
  children,
  ...dialogProps
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm')) && responsive;

  const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick' && disableBackdropClick) {
      return;
    }
    if (onClose) {
      onClose(event, reason);
    }
  };

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      {...dialogProps}
    >
      {(title || showCloseButton) && (
        <StyledDialogTitle>
          <Box>
            {title && (
              <Typography variant="h6" component="div">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {showCloseButton && onClose && (
            <CloseButton
              aria-label="close"
              onClick={(event) => onClose(event, 'escapeKeyDown')}
            >
              <Close />
            </CloseButton>
          )}
        </StyledDialogTitle>
      )}
      
      {(content || contentText || children) && (
        <DialogContent>
          {contentText && (
            <DialogContentText>{contentText}</DialogContentText>
          )}
          {content || children}
        </DialogContent>
      )}
      
      {actions && (
        <DialogActions>{actions}</DialogActions>
      )}
    </MuiDialog>
  );
};

export default Dialog;

// Preset dialog templates
export const AlertDialog: React.FC<{
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  severity?: 'info' | 'warning' | 'error' | 'success';
}> = ({ open, title, message, onClose, severity = 'info' }) => {
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircle color="success" sx={{ mr: 1 }} />;
      case 'error':
        return <Error color="error" sx={{ mr: 1 }} />;
      case 'warning':
        return <Warning color="warning" sx={{ mr: 1 }} />;
      default:
        return <Info color="info" sx={{ mr: 1 }} />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      actions={
        <Button onClick={onClose} variant="contained">
          OK
        </Button>
      }
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {getIcon()}
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Typography>{message}</Typography>
    </Dialog>
  );
};

export const FormDialog: React.FC<{
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
}> = ({
  open,
  title,
  onClose,
  onSubmit,
  children,
  submitText = 'Submit',
  cancelText = 'Cancel',
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      fullWidth
      disableBackdropClick={loading}
      actions={
        <>
          <Button onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button 
            onClick={onSubmit} 
            variant="contained" 
            disabled={loading}
            loading={loading}
          >
            {submitText}
          </Button>
        </>
      }
    >
      {children}
    </Dialog>
  );
};

// Import necessary components
import { Box } from '@mui/material';
import { CheckCircle, Error, Warning, Info } from '@mui/icons-material';
import Button from '../Buttons/Button';