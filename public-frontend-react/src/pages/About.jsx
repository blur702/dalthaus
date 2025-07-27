import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
} from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper
        elevation={1}
        sx={{
          p: { xs: 3, md: 5 },
          backgroundColor: 'background.paper',
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontFamily: 'Georgia, serif',
            fontWeight: 'normal',
            mb: 4,
          }}
        >
          About
        </Typography>

        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          Welcome to Don Althaus Photography. This is a showcase of photographic work
          and storytelling through images.
        </Typography>

        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          Photography is about capturing moments, telling stories, and creating
          connections with viewers. Each image represents a unique perspective
          and narrative.
        </Typography>

        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          Feel free to explore the articles and photo books to discover more
          about the art and craft of photography.
        </Typography>
      </Paper>
    </Container>
  );
};

export default About;