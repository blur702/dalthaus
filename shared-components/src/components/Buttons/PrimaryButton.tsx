import React from 'react';
import Button, { ButtonProps } from './Button';
import { styled } from '@mui/material/styles';

const StyledPrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[4],
  },
  '&:active': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

const PrimaryButton: React.FC<ButtonProps> = (props) => {
  return <StyledPrimaryButton variant="contained" {...props} />;
};

export default PrimaryButton;