import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';

function CardComponent({ image, title, onClick }) {
  return (
    <Card onClick={onClick} sx={{ maxWidth: 345 }}>
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
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px' }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CardComponent;
