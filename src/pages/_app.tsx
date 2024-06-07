import { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { useRouter } from 'next/router';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import theme from '../theme';
import { CssBaseline } from '@mui/material';


const queryClient = new QueryClient();
 
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Conditionally exclude the layout for the login page
  const noLayout = ['/login', '/register'].includes(router.pathname);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {noLayout ? (
              <Component {...pageProps} />
              ) : (
                <ProtectedRoute>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ProtectedRoute>
            )}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}