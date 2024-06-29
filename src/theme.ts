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
      // color: 'rgb(75 85 99)',
      color: '1a1e23'
    },
    body2: {
      color: '1a1e23'
    },
    h1: {
      color: '#1a1e23'
    },
    h2: {
      color: '#1a1e23'
    },
    h3: {
      color: '#1a1e23'
    },
    h4: {
      color: '#1a1e23'
    }, 
    h5: {
      color: '#1a1e23'
    }
  },
  palette: {
    primary: {
      main: deepPurple[500],
      
      50: deepPurple[50],
      100: deepPurple[100]
    }
  },
  components: {
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(243, 244, 246)'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: 'none',
        },
      },
    },
  }
});

export default theme;