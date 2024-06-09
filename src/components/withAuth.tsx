import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useGetCurrentUser } from '../hooks/useUsers';

export const withAuth = (Component: React.FC<any>, allowedRoles: string[]) => {
  const AuthenticatedComponent: React.FC<any> = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { data: userData, isLoading } = useGetCurrentUser();
    const role = userData?.role;

    console.warn(userData)

    useEffect(() => {
      if (loading || isLoading) return;
      
      if (!user) {
        router.push('/login');
      } else if (!allowedRoles.includes(role!)) {
        router.push('/unauthorized'); // or redirect to a specific dashboard
      }
      
    }, [user, role, loading, router, isLoading]);

    if (loading || !user || !allowedRoles.includes(role!)) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};