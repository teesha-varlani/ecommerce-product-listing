import React from 'react';
import Navbar from '../components/Navbar';
import ThemeProvider from '../../src/theme-provider'; 

export const metadata = {           //setting up meta data for seo 
  title: 'E-commerce App',
  description: 'Product listing with admin features',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
