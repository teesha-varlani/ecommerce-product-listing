'use client';
import React, { useEffect, useState } from 'react';
// import  Grid  from '@mui/material';
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Paper,
} from '@mui/material';
import ProductCard from '../components/ProductCard';        //to use product card component

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export default function HomePage() {
  //fetching, searching, sorting, pagination use states
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [search, sort, page]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `https://ecommerce-product-listing-e2g3.onrender.com/api/products?search=${search}&sort=${sort}&page=${page}`
      );
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('could not products:', err);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1280px', mx: 'auto' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Our Products
      </Typography>

      {/* search and sort */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4,
        }}
      >
        <Box sx={{ flex: '1 1 300px' }}>
          <TextField
            fullWidth
            label="Search products"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <Select
            fullWidth
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            displayEmpty
          >
            <MenuItem value="asc">Price: Low to High</MenuItem>
            <MenuItem value="desc">Price: High to Low</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* to show products in grid*/}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
        }}
      >
        {products.map((product) => (
          <Box key={product._id} sx={{ width: { xs: '100%', sm: '45%', md: '22%' } }}>
            <ProductCard {...product} />
          </Box>
        ))}
      </Box>

      {/* pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, gap: 2 }}>
        <Button
          variant="contained"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Previous
        </Button>
        <Paper elevation={2} sx={{ px: 3, py: 1, display: 'flex', alignItems: 'center' }}>
          Page {page} of {totalPages}
        </Paper>
        <Button
          variant="contained"
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
