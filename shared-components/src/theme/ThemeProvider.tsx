import React from 'react';
import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import defaultTheme from './defaultTheme';

export interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: Theme;
  injectGlobal?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  theme = defaultTheme,
  injectGlobal = true
}) => {
  return (
    <MuiThemeProvider theme={theme}>
      {injectGlobal && <CssBaseline />}
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;