import React from 'react';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { CssBaseline } from '@mui/material';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: [
        'Introduction',
        'Components',
        ['Buttons', 'Forms', 'Cards', 'Alerts', 'Loading', 'Modals', 'Layout'],
      ],
    },
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  ),
];