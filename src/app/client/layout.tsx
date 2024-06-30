'use client'
import { withAuth } from '@/src/components/withAuth';
import Sidebar from '../../components/ClientSidebar';
import { Box, Toolbar } from '@mui/material';


const ClientLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
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

export default withAuth(ClientLayout, ['client'])