'use client';
import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
        <Typography variant="h6" component={Link} href="/" sx={{ textDecoration: 'none', color: 'white' }}>
          E-Com
        </Typography>
        <Button color="inherit" component={Link} href="/">Home</Button>
        <Button color="inherit" component={Link} href="/admin">Admin</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
