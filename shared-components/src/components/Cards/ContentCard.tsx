import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  CardMedia,
  Typography,
  IconButton,
  Avatar,
  CardProps,
  Chip,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { MoreVert, Share, Favorite, BookmarkBorder } from '@mui/icons-material';

export interface ContentCardProps extends CardProps {
  title: string;
  subtitle?: string;
  content: string | React.ReactNode;
  image?: string;
  imageHeight?: number;
  avatar?: string | React.ReactNode;
  author?: string;
  date?: string;
  tags?: string[];
  actions?: React.ReactNode;
  onShare?: () => void;
  onLike?: () => void;
  onBookmark?: () => void;
  onMenuClick?: () => void;
  truncateContent?: boolean;
  maxContentLength?: number;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

const TagsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(2),
}));

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  content,
  image,
  imageHeight = 200,
  avatar,
  author,
  date,
  tags = [],
  actions,
  onShare,
  onLike,
  onBookmark,
  onMenuClick,
  truncateContent = true,
  maxContentLength = 150,
  ...cardProps
}) => {
  const renderAvatar = () => {
    if (typeof avatar === 'string') {
      return <Avatar src={avatar} />;
    }
    if (React.isValidElement(avatar)) {
      return avatar;
    }
    if (author) {
      return <Avatar>{author.charAt(0).toUpperCase()}</Avatar>;
    }
    return null;
  };

  const renderContent = () => {
    if (typeof content === 'string' && truncateContent && content.length > maxContentLength) {
      return content.substring(0, maxContentLength) + '...';
    }
    return content;
  };

  const hasHeaderActions = onMenuClick || author || date;

  return (
    <StyledCard {...cardProps}>
      {image && (
        <CardMedia
          component="img"
          height={imageHeight}
          image={image}
          alt={title}
        />
      )}
      
      {hasHeaderActions && (
        <CardHeader
          avatar={renderAvatar()}
          action={
            onMenuClick && (
              <IconButton onClick={onMenuClick} size="small">
                <MoreVert />
              </IconButton>
            )
          }
          title={author}
          subheader={date}
        />
      )}

      <StyledCardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {subtitle}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" paragraph>
          {renderContent()}
        </Typography>

        {tags.length > 0 && (
          <TagsContainer>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                clickable
              />
            ))}
          </TagsContainer>
        )}
      </StyledCardContent>

      {(actions || onShare || onLike || onBookmark) && (
        <CardActions disableSpacing>
          {onLike && (
            <IconButton onClick={onLike} aria-label="like">
              <Favorite />
            </IconButton>
          )}
          {onShare && (
            <IconButton onClick={onShare} aria-label="share">
              <Share />
            </IconButton>
          )}
          {onBookmark && (
            <IconButton onClick={onBookmark} aria-label="bookmark">
              <BookmarkBorder />
            </IconButton>
          )}
          {actions && <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>{actions}</Box>}
        </CardActions>
      )}
    </StyledCard>
  );
};

export default ContentCard;