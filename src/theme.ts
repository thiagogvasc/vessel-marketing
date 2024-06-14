'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { blue, deepPurple, purple } from '@mui/material/colors';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
    body1: {
      color: 'rgb(75 85 99)',
    },
  },
  palette: {
    primary: {
      main: deepPurple[700],
      
      50: deepPurple[50],
      100: deepPurple[100]
    }
  }
});

export default theme;