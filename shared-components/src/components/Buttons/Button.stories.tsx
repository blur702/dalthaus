import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Button, { ButtonProps } from './Button';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import DangerButton from './DangerButton';
import SuccessButton from './SuccessButton';
import { Stack } from '@mui/material';

export default {
  title: 'Components/Buttons',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'outlined', 'contained'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'error', 'warning', 'info', 'success'],
    },
    loading: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    fullWidth: {
      control: { type: 'boolean' },
    },
  },
} as Meta<ButtonProps>;

const Template: StoryFn<ButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Button',
  variant: 'contained',
};

export const AllVariants: StoryFn = () => (
  <Stack direction="row" spacing={2}>
    <Button variant="text">Text</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="contained">Contained</Button>
  </Stack>
);

export const AllSizes: StoryFn = () => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Button size="small">Small</Button>
    <Button size="medium">Medium</Button>
    <Button size="large">Large</Button>
  </Stack>
);

export const ButtonTypes: StoryFn = () => (
  <Stack direction="row" spacing={2}>
    <PrimaryButton>Primary</PrimaryButton>
    <SecondaryButton>Secondary</SecondaryButton>
    <SuccessButton>Success</SuccessButton>
    <DangerButton>Danger</DangerButton>
  </Stack>
);

export const LoadingStates: StoryFn = () => (
  <Stack direction="row" spacing={2}>
    <PrimaryButton loading>Primary</PrimaryButton>
    <SecondaryButton loading>Secondary</SecondaryButton>
    <SuccessButton loading>Success</SuccessButton>
    <DangerButton loading>Danger</DangerButton>
  </Stack>
);

export const DisabledStates: StoryFn = () => (
  <Stack direction="row" spacing={2}>
    <PrimaryButton disabled>Primary</PrimaryButton>
    <SecondaryButton disabled>Secondary</SecondaryButton>
    <SuccessButton disabled>Success</SuccessButton>
    <DangerButton disabled>Danger</DangerButton>
  </Stack>
);

export const FullWidth: StoryFn = () => (
  <Stack spacing={2}>
    <PrimaryButton fullWidth>Primary Full Width</PrimaryButton>
    <SecondaryButton fullWidth>Secondary Full Width</SecondaryButton>
    <SuccessButton fullWidth>Success Full Width</SuccessButton>
    <DangerButton fullWidth>Danger Full Width</DangerButton>
  </Stack>
);