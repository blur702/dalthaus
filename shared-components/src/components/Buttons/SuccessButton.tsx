import React from 'react';
import Button, { ButtonProps } from './Button';
import { styled } from '@mui/material/styles';

const StyledSuccessButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
    boxShadow: theme.shadows[4],
  },
  '&:active': {
    backgroundColor: theme.palette.success.dark,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

const SuccessButton: React.FC<ButtonProps> = (props) => {
  return <StyledSuccessButton variant="contained" {...props} />;
};

export default SuccessButton;