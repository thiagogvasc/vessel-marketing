'use client'
import Sidebar from '../../components/Sidebar';
import { Box, Toolbar } from '@mui/material';


export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          background: 'rgb(243 244 246)',
          height: '100vh'
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
