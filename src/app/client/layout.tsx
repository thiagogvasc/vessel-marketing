'use client'
import { withAuth } from '@/src/components/withAuth';
import ClientSidebar from '../../components/ClientSidebar';
import { Box, Toolbar } from '@mui/material';


const ClientLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <ClientSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 12,
          height: '100%'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default withAuth(ClientLayout, ['client'])