import React from 'react';
import { Box, Typography, Paper, Stepper, Step, StepLabel, StepContent, Alert } from '@mui/material';
import { Image, TouchApp, CloudUpload, CheckCircle } from '@mui/icons-material';

const LightboxWorkflowGuide = ({ onClose }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', my: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#404040' }}>
        📸 Lightbox Image Workflow
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Purpose:</strong> Display a smaller image in your article (800x600) but show a full-resolution version when clicked.
        </Typography>
      </Alert>

      <Stepper orientation="vertical" sx={{ mt: 2 }}>
        <Step active={true}>
          <StepLabel icon={<Image />}>
            <Typography variant="subtitle1">Insert Display Image</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary">
              Upload or insert your article image normally (recommended: 800x600px)
            </Typography>
            <Box sx={{ bgcolor: '#f5f5f5', p: 1, mt: 1, borderRadius: 1 }}>
              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                TinyMCE → Insert → Image
              </Typography>
            </Box>
          </StepContent>
        </Step>

        <Step active={true}>
          <StepLabel icon={<TouchApp />}>
            <Typography variant="subtitle1">Select the Image</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary">
              Click on the image you just inserted to select it
            </Typography>
          </StepContent>
        </Step>

        <Step active={true}>
          <StepLabel icon={<CloudUpload />}>
            <Typography variant="subtitle1">Set Lightbox Version</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary">
              Click the "Set Lightbox Image" button in the toolbar
            </Typography>
            <Box sx={{ bgcolor: '#f5f5f5', p: 1, mt: 1, borderRadius: 1 }}>
              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                Toolbar → 🖼️ Set Lightbox Image
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Upload your full-resolution or alternative image
            </Typography>
          </StepContent>
        </Step>

        <Step active={true}>
          <StepLabel icon={<CheckCircle />}>
            <Typography variant="subtitle1">Complete!</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary">
              • Your article shows the display image (fast loading)<br/>
              • Clicking opens the lightbox version (full quality)<br/>
              • Images with lightbox show a 🔍 indicator on hover
            </Typography>
          </StepContent>
        </Step>
      </Stepper>

      <Box sx={{ mt: 3, p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ color: '#2e7d32' }}>
          💡 Pro Tips:
        </Typography>
        <Typography variant="body2" sx={{ color: '#2e7d32' }}>
          • Display image: Optimized for web (800x600, ~100KB)<br/>
          • Lightbox image: Full resolution for detail viewing<br/>
          • You can use completely different images if desired<br/>
          • Right-click any image → "Set Lightbox Image" also works
        </Typography>
      </Box>
    </Paper>
  );
};

export default LightboxWorkflowGuide;