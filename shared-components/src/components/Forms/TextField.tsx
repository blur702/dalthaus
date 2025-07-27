import React, { useState } from 'react';
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircle, Error } from '@mui/icons-material';

export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'error' | 'helperText'> {
  validationRules?: ValidationRule[];
  showValidationIcon?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-error fieldset': {
      borderColor: theme.palette.error.main,
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
}));

const TextField: React.FC<TextFieldProps> = ({
  validationRules = [],
  showValidationIcon = true,
  validateOnBlur = true,
  validateOnChange = false,
  onValidationChange,
  value: propValue,
  onChange: propOnChange,
  onBlur: propOnBlur,
  ...props
}) => {
  const [value, setValue] = useState(propValue || '');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (val: string): boolean => {
    for (const rule of validationRules) {
      if (!rule.validate(val)) {
        setError(rule.message);
        onValidationChange?.(false);
        return false;
      }
    }
    setError(null);
    onValidationChange?.(true);
    return true;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    
    if (validateOnChange && touched) {
      validate(newValue);
    }

    propOnChange?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    
    if (validateOnBlur) {
      validate(event.target.value);
    }

    propOnBlur?.(event);
  };

  const isValid = touched && !error && validationRules.length > 0;
  const showError = touched && !!error;

  const endAdornment = showValidationIcon && touched && (
    <InputAdornment position="end">
      {isValid && <CheckCircle color="success" fontSize="small" />}
      {showError && <Error color="error" fontSize="small" />}
    </InputAdornment>
  );

  return (
    <>
      <StyledTextField
        {...props}
        value={propValue !== undefined ? propValue : value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={showError}
        helperText={showError ? error : props.helperText}
        InputProps={{
          ...props.InputProps,
          endAdornment: props.InputProps?.endAdornment || endAdornment,
        }}
      />
    </>
  );
};

export default TextField;

// Common validation rules
export const ValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value: string) => value.trim().length > 0,
    message,
  }),
  
  email: (message = 'Please enter a valid email'): ValidationRule => ({
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),
  
  minLength: (length: number, message?: string): ValidationRule => ({
    validate: (value: string) => value.length >= length,
    message: message || `Minimum ${length} characters required`,
  }),
  
  maxLength: (length: number, message?: string): ValidationRule => ({
    validate: (value: string) => value.length <= length,
    message: message || `Maximum ${length} characters allowed`,
  }),
  
  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
    validate: (value: string) => regex.test(value),
    message,
  }),
  
  numeric: (message = 'Only numbers are allowed'): ValidationRule => ({
    validate: (value: string) => /^\d*$/.test(value),
    message,
  }),
};