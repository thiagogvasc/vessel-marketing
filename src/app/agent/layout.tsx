'use client'
import { withAuth } from '@/src/components/withAuth';
import { Box, Toolbar } from '@mui/material';
import AgentSidebar from '@/src/components/AgentSidebar';


const AgentLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <AgentSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 12,
          background: '#fcfbfe',
          height: '100%'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default withAuth(AgentLayout, ['agent'])