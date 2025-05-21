import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image }) => {
  return (
    <Card
      sx={{
        maxWidth: 300,
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={name}
        sx={{ borderRadius: '12px 12px 0 0', objectFit: 'cover' }}
      />
      <CardContent>
        <Chip
          label="DummyBrand"
          size="small"
          sx={{ mb: 1, bgcolor: '#f3f3f3', fontWeight: 500 }}
        />
        <Typography gutterBottom variant="h6" component="div">
          {name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            ⭐️⭐️⭐️⭐️☆
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (23)
          </Typography>
        </Box>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          ₹{price.toFixed(2)}
        </Typography>
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: '#ffcc00',
            color: '#000',
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#ffb300',
            },
          }}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
