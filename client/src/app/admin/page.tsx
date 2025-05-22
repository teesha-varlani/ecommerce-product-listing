'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Divider,
  Stack,
} from '@mui/material';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      fetchProducts();
    }
    setAuthChecked(true);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://ecommerce-product-listing-e2g3.onrender.com/api/products');
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      console.error('could not fetch products', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = { name, price: parseFloat(price), image };

    try {
      const res = await fetch(
        editingId
          ? `https://ecommerce-product-listing-e2g3.onrender.com/api/products/${editingId}`
          : 'https://ecommerce-product-listing-e2g3.onrender.com/api/products',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(newProduct),
        }
      );

      if (res.ok) {
        alert(`Product ${editingId ? 'updated' : 'added'}!`);
        setName('');
        setPrice('');
        setImage('');
        setEditingId(null);
        fetchProducts();
      } else {
        alert('could not save product');
      }
    } catch (err) {
      alert('Error connecting to server');
      console.error(err);
    }
  };

  const handleEdit = (product: Product) => {
    setName(product.name);
    setPrice(product.price.toString());
    setImage(product.image);
    setEditingId(product._id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`https://ecommerce-product-listing-e2g3.onrender.com/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.ok) {
        alert('🗑️ Product deleted');
        fetchProducts();
      } else {
        alert('could not delete product');
      }
    } catch (err) {
      alert('Error connecting to server');
      console.error(err);
    }
  };

  if (!authChecked || !isAuthenticated) return null;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }}
        sx={{ mb: 4 }}
      >
        Logout
      </Button>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {editingId ? 'Edit Product' : 'Add New Product'}
      </Typography>

      <Paper elevation={4} sx={{ p: 3, mb: 6 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Product Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <TextField
                label="Price"
                type="number"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <TextField
                label="Image URL"
                fullWidth
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </Box>
            <Button fullWidth variant="contained" size="large" type="submit">
              {editingId ? 'Update Product' : 'Add Product'}
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h5" gutterBottom>
        Current Products
      </Typography>

      <Stack spacing={2}>
        {products.map((product) => (
          <Paper
            key={product._id}
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {product.name}
              </Typography>
              <Typography color="text.secondary">
                ₹{product.price.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                color="warning"
                fullWidth
                onClick={() => handleEdit(product)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
