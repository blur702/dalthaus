import React from 'react';
import Button, { ButtonProps } from './Button';
import { styled } from '@mui/material/styles';

const StyledDangerButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
    boxShadow: theme.shadows[4],
  },
  '&:active': {
    backgroundColor: theme.palette.error.dark,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

const DangerButton: React.FC<ButtonProps> = (props) => {
  return <StyledDangerButton variant="contained" {...props} />;
};

export default DangerButton;