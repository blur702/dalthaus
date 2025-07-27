import React from 'react';
import {
  Modal as MuiModal,
  ModalProps as MuiModalProps,
  Box,
  Typography,
  IconButton,
  Divider,
  Fade,
  Backdrop,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material';

export interface ModalProps extends Omit<MuiModalProps, 'children'> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  width?: string | number;
  maxWidth?: string | number;
  fullScreen?: boolean;
  fullWidth?: boolean;
  showDivider?: boolean;
  footer?: React.ReactNode;
  onClose?: () => void;
  disableBackdropClick?: boolean;
}

const ModalBox = styled(Box)<{ 
  fullScreen?: boolean; 
  width?: string | number;
  maxWidth?: string | number;
}>(({ theme, fullScreen, width, maxWidth }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  borderRadius: fullScreen ? 0 : theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[24],
  padding: 0,
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: fullScreen ? '100vh' : '90vh',
  width: fullScreen ? '100vw' : width || 'auto',
  maxWidth: fullScreen ? '100vw' : maxWidth || 600,
  height: fullScreen ? '100vh' : 'auto',
  ...(fullScreen && {
    position: 'fixed',
    top: 0,
    left: 0,
    transform: 'none',
  }),
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(1),
  overflowY: 'auto',
  flexGrow: 1,
}));

const ModalFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
}));

const Modal: React.FC<ModalProps> = ({
  open,
  title,
  subtitle,
  children,
  showCloseButton = true,
  width,
  maxWidth,
  fullScreen = false,
  fullWidth = false,
  showDivider = true,
  footer,
  onClose,
  disableBackdropClick = false,
  ...modalProps
}) => {
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (!disableBackdropClick && onClose) {
      onClose();
    }
  };

  const modalWidth = fullWidth ? '100%' : width;

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          onClick: handleBackdropClick,
        },
      }}
      {...modalProps}
    >
      <Fade in={open}>
        <ModalBox fullScreen={fullScreen} width={modalWidth} maxWidth={maxWidth}>
          {(title || showCloseButton) && (
            <>
              <ModalHeader>
                <Box flex={1}>
                  {title && (
                    <Typography variant="h5" component="h2" fontWeight={600}>
                      {title}
                    </Typography>
                  )}
                  {subtitle && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {subtitle}
                    </Typography>
                  )}
                </Box>
                {showCloseButton && onClose && (
                  <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{ ml: 2, mt: -0.5 }}
                    aria-label="close"
                  >
                    <Close />
                  </IconButton>
                )}
              </ModalHeader>
              {showDivider && <Divider />}
            </>
          )}
          
          <ModalContent>
            {children}
          </ModalContent>
          
          {footer && (
            <>
              {showDivider && <Divider />}
              <ModalFooter>
                {footer}
              </ModalFooter>
            </>
          )}
        </ModalBox>
      </Fade>
    </MuiModal>
  );
};

export default Modal;

// Preset modal configurations
export const ConfirmModal: React.FC<{
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}> = ({
  open,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  danger = false,
}) => {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      maxWidth={400}
      footer={
        <>
          <Button variant="outlined" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant="contained"
            color={danger ? 'error' : 'primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <Typography>{message}</Typography>
    </Modal>
  );
};

// Import Button for ConfirmModal
import Button from '../Buttons/Button';