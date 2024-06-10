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
    <Box sx={{ display: 'flex' }}>
      <AgentSidebar />
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

export default withAuth(AgentLayout, ['agent'])