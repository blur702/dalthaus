import React from 'react';
import Button, { ButtonProps } from './Button';
import { styled } from '@mui/material/styles';

const StyledSecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  border: `2px solid ${theme.palette.primary.main}`,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: theme.shadows[4],
  },
  '&:active': {
    backgroundColor: theme.palette.primary.dark,
    borderColor: theme.palette.primary.dark,
  },
  '&.Mui-disabled': {
    borderColor: theme.palette.action.disabled,
    color: theme.palette.action.disabled,
  },
}));

const SecondaryButton: React.FC<ButtonProps> = (props) => {
  return <StyledSecondaryButton variant="outlined" {...props} />;
};

export default SecondaryButton;