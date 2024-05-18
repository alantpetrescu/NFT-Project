import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import PropTypes from 'prop-types';

function CardComponent({ image, title, onClick }) {
  return (
    <Card onClick={onClick} sx={{ maxWidth: 345, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={title}
          image={image}
          sx={{ 
            borderRadius: '12px 12px 0 0',
            height: 200,
            objectFit: 'cover',
          }}
        />
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

CardComponent.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default React.memo(CardComponent);
