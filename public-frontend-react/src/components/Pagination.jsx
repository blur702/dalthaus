import React from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPrevious,
  onNext,
  canGoPrev,
  canGoNext,
}) => {
  if (totalPages <= 1) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 5,
        pt: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
      }}
    >
      <Button
        startIcon={<ArrowBack />}
        onClick={onPrevious}
        disabled={!canGoPrev}
        variant="outlined"
        sx={{
          minWidth: 150,
          order: { xs: 2, sm: 1 },
        }}
      >
        Previous Page
      </Button>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          order: { xs: 1, sm: 2 },
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Page {currentPage} of {totalPages}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {[...Array(totalPages)].map((_, index) => (
            <IconButton
              key={index}
              size="small"
              onClick={() => onPageChange(index + 1)}
              sx={{
                width: currentPage === index + 1 ? 12 : 10,
                height: currentPage === index + 1 ? 12 : 10,
                p: 0,
                minWidth: 0,
                backgroundColor:
                  currentPage === index + 1 ? '#d9534f' : 'action.disabled',
                '&:hover': {
                  backgroundColor:
                    currentPage === index + 1 ? '#c9302c' : 'action.selected',
                },
                transition: 'all 0.3s',
              }}
            />
          ))}
        </Box>
      </Box>

      <Button
        endIcon={<ArrowForward />}
        onClick={onNext}
        disabled={!canGoNext}
        variant="outlined"
        sx={{
          minWidth: 150,
          order: 3,
        }}
      >
        Next Page
      </Button>
    </Box>
  );
};

export default Pagination;