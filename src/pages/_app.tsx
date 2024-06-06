import { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { useRouter } from 'next/router';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
 
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Conditionally exclude the layout for the login page
  const noLayout = ['/login', '/register'].includes(router.pathname);

  return (
    <AuthProvider>
      {noLayout ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}