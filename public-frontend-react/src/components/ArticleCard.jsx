import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { isAdminLoggedIn, getEditLink } from '../services/api';

const ArticleCard = ({ 
  title, 
  slug, 
  body, 
  coverImageUrl, 
  type = 'article',
  id,
  excerpt,
  linkText = 'Read more',
  linkPath,
}) => {
  const isAdmin = isAdminLoggedIn();
  const editUrl = getEditLink(type, id);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 5,
        },
        '&:hover .edit-link': {
          opacity: 1,
        },
      }}
    >
      {isAdmin && editUrl && (
        <IconButton
          component={MuiLink}
          href={editUrl}
          target="_blank"
          className="edit-link"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 10,
            opacity: 0,
            transition: 'opacity 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            },
          }}
          size="small"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      )}

      <CardMedia
        component="img"
        height="250"
        image={coverImageUrl || '/images/placeholder.svg'}
        alt={title}
        onError={(e) => {
          e.target.src = '/images/placeholder.svg';
        }}
        sx={{
          backgroundColor: '#f0f0f0',
        }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h5"
          component={Link}
          to={linkPath || `/${type}/${slug}`}
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            fontFamily: 'Georgia, serif',
            '&:hover': {
              color: 'text.secondary',
            },
          }}
        >
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {excerpt}
        </Typography>

        <MuiLink
          component={Link}
          to={linkPath || `/${type}/${slug}`}
          sx={{
            color: '#d9534f',
            textDecoration: 'none',
            fontStyle: 'italic',
            fontSize: '14px',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {linkText}
        </MuiLink>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;