import React from 'react';
import {
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  OutlinedInput,
  Chip,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<MuiSelectProps, 'children'> {
  options: SelectOption[];
  label?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  multiple?: boolean;
  showChips?: boolean;
}

const StyledFormControl = styled(FormControl)(({ theme }) => ({
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

const Select: React.FC<SelectProps> = ({
  options,
  label,
  helperText,
  error = false,
  fullWidth = true,
  multiple = false,
  showChips = true,
  value,
  ...props
}) => {
  const labelId = `select-${label?.replace(/\s+/g, '-').toLowerCase()}-label`;

  const renderValue = (selected: any) => {
    if (!multiple) {
      const option = options.find(opt => opt.value === selected);
      return option?.label || '';
    }

    if (showChips) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {(selected as Array<string | number>).map((value) => {
            const option = options.find(opt => opt.value === value);
            return option ? (
              <Chip key={value} label={option.label} size="small" />
            ) : null;
          })}
        </Box>
      );
    }

    return (selected as Array<string | number>)
      .map(value => {
        const option = options.find(opt => opt.value === value);
        return option?.label || '';
      })
      .join(', ');
  };

  return (
    <StyledFormControl fullWidth={fullWidth} error={error}>
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <MuiSelect
        labelId={labelId}
        value={value || (multiple ? [] : '')}
        label={label}
        multiple={multiple}
        input={<OutlinedInput label={label} />}
        renderValue={renderValue}
        {...props}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </StyledFormControl>
  );
};

export default Select;

// Common option generators
export const CommonOptions = {
  countries: (): SelectOption[] => [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'es', label: 'Spain' },
    { value: 'it', label: 'Italy' },
    { value: 'jp', label: 'Japan' },
    { value: 'cn', label: 'China' },
    { value: 'au', label: 'Australia' },
  ],

  status: (): SelectOption[] => [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'archived', label: 'Archived' },
  ],

  priority: (): SelectOption[] => [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ],

  boolean: (): SelectOption[] => [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
  ],

  months: (): SelectOption[] => [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ],

  years: (startYear: number = 2020, endYear: number = new Date().getFullYear()): SelectOption[] => {
    const years: SelectOption[] = [];
    for (let year = endYear; year >= startYear; year--) {
      years.push({ value: year, label: year.toString() });
    }
    return years;
  },

  timeZones: (): SelectOption[] => [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Asia/Shanghai', label: 'Shanghai' },
    { value: 'Australia/Sydney', label: 'Sydney' },
  ],
};