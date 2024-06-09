'use client'

import { ReactNode } from "react";
import { AuthProvider } from '../contexts/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import theme from '../theme';
import { CssBaseline } from '@mui/material';

const queryClient = new QueryClient();
export const ContextProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
              { children }
          </ThemeProvider>
        </AppRouterCacheProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};
