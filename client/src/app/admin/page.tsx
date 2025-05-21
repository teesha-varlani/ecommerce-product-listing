'use client';
import React, { useEffect, useState } from 'react';         //hooks for state management
import { useRouter } from 'next/navigation';        //to route to different page
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
  Divider,
} from '@mui/material';         //components of material UI

interface Product {             //product information interface
  _id: string;
  name: string;
  price: number;
  image: string;
}                 

export default function AdminPage() {
  //products state managing 
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  //authentication using state management
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //for navigating through pages
  const router = useRouter();

  useEffect(() => {
    //load page only if token is validated
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
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      console.error('could not fetch products', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    //add product
    e.preventDefault();
    const newProduct = { name, price: parseFloat(price), image };

    try {
      const res = await fetch(
        editingId
          ? `http://localhost:5000/api/products/${editingId}`
          : 'http://localhost:5000/api/products',
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
    //edit product
    setName(product.name);
    setPrice(product.price.toString());
    setImage(product.image);
    setEditingId(product._id);
  };

  const handleDelete = async (id: string) => {
    //delete product
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
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
          <Grid container spacing={3}>
            <Grid xs={12}>
              <TextField
                label="Product Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                label="Image URL"
                fullWidth
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </Grid>
            <Grid xs={12}>
              <Button fullWidth variant="contained" size="large" type="submit">
                {editingId ? 'Update Product' : 'Add Product'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h5" gutterBottom>
        Current Products
      </Typography>

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid xs={12} sm={6} key={product._id}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
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
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
