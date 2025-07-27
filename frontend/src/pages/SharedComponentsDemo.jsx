import React, { useState } from 'react';
import {
  Container,
  Grid,
  GridItem,
  Stack,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  SuccessButton,
  TextField,
  Select,
  CommonOptions,
  ValidationRules,
  ContentCard,
  FeatureCard,
  Alert,
  SuccessAlert,
  ErrorAlert,
  Spinner,
  Skeleton,
  Modal,
  Dialog,
  ThemeProvider
} from '@cms/shared-components';
import { Typography, Box } from '@mui/material';

const SharedComponentsDemo = () => {
  const [textValue, setTextValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Form submitted!');
    }, 2000);
  };

  return (
    <ThemeProvider>
      <Container variant="wide" padding="large">
        <Typography variant="h3" gutterBottom>
          Shared Components Demo
        </Typography>

        <Stack spacing={4}>
          {/* Buttons Section */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Buttons
            </Typography>
            <Stack direction="row" spacing={2}>
              <PrimaryButton onClick={() => alert('Primary clicked')}>
                Primary Button
              </PrimaryButton>
              <SecondaryButton>Secondary Button</SecondaryButton>
              <SuccessButton>Success Button</SuccessButton>
              <DangerButton>Danger Button</DangerButton>
            </Stack>
          </Box>

          {/* Forms Section */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Form Components
            </Typography>
            <Grid container spacing={3}>
              <GridItem xs={12} md={6}>
                <TextField
                  label="Email Address"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  validationRules={[
                    ValidationRules.required(),
                    ValidationRules.email()
                  ]}
                  validateOnBlur
                  showValidationIcon
                  fullWidth
                />
              </GridItem>
              <GridItem xs={12} md={6}>
                <Select
                  label="Country"
                  value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                  options={CommonOptions.countries()}
                  fullWidth
                />
              </GridItem>
            </Grid>
          </Box>

          {/* Cards Section */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Cards
            </Typography>
            <Grid container spacing={3}>
              <GridItem xs={12} md={6}>
                <ContentCard
                  title="Content Card Example"
                  subtitle="Published today"
                  content="This is an example of a content card with various features like tags, actions, and author information."
                  author="John Doe"
                  date="January 23, 2024"
                  tags={['React', 'Material UI', 'Components']}
                  onShare={() => console.log('Share clicked')}
                  onLike={() => console.log('Like clicked')}
                />
              </GridItem>
              <GridItem xs={12} md={6}>
                <FeatureCard
                  icon="🚀"
                  title="Feature Card"
                  description="This card highlights a specific feature with an icon and optional action button."
                  features={[
                    'Easy to use',
                    'Fully customizable',
                    'Responsive design'
                  ]}
                  action={{
                    label: 'Learn More',
                    onClick: () => console.log('Learn more clicked')
                  }}
                  highlight
                />
              </GridItem>
            </Grid>
          </Box>

          {/* Alerts Section */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Alerts
            </Typography>
            <Stack spacing={2}>
              <SuccessAlert dismissible>
                This is a success alert with dismiss button
              </SuccessAlert>
              <ErrorAlert title="Error" dismissible>
                Something went wrong. Please try again.
              </ErrorAlert>
              <Alert severity="info" variant="outlined">
                This is an outlined info alert
              </Alert>
            </Stack>
          </Box>

          {/* Loading States Section */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Loading States
            </Typography>
            <Grid container spacing={3}>
              <GridItem xs={12} md={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Spinner size="large" label="Loading content..." />
                </Box>
              </GridItem>
              <GridItem xs={12} md={6}>
                <Skeleton type="card" />
              </GridItem>
            </Grid>
          </Box>

          {/* Modal/Dialog Section */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Modals & Dialogs
            </Typography>
            <Stack direction="row" spacing={2}>
              <PrimaryButton onClick={() => setShowModal(true)}>
                Open Modal
              </PrimaryButton>
              <SecondaryButton onClick={() => setShowDialog(true)}>
                Open Dialog
              </SecondaryButton>
            </Stack>
          </Box>

          {/* Action Buttons */}
          <Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <SecondaryButton onClick={() => window.history.back()}>
                Back
              </SecondaryButton>
              <PrimaryButton onClick={handleSubmit} loading={loading}>
                Submit Demo
              </PrimaryButton>
            </Stack>
          </Box>
        </Stack>

        {/* Modal */}
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          title="Example Modal"
          subtitle="This is a modal from the shared components"
          footer={
            <>
              <SecondaryButton onClick={() => setShowModal(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={() => setShowModal(false)}>
                Save Changes
              </PrimaryButton>
            </>
          }
        >
          <Stack spacing={2}>
            <TextField label="Name" fullWidth />
            <TextField label="Description" multiline rows={4} fullWidth />
          </Stack>
        </Modal>

        {/* Dialog */}
        <Dialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          title="Confirm Action"
          actions={
            <>
              <SecondaryButton onClick={() => setShowDialog(false)}>
                Cancel
              </SecondaryButton>
              <DangerButton onClick={() => setShowDialog(false)}>
                Delete
              </DangerButton>
            </>
          }
        >
          <Typography>
            Are you sure you want to delete this item? This action cannot be undone.
          </Typography>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default SharedComponentsDemo;