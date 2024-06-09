'use client'

// withAuth.tsx
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useGetCurrentUser } from '../hooks/useUsers';

export const withAuth = (Component: React.FC, allowedRoles: string[]) => {
  const AuthenticatedComponent = (props: any) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { data: userData } = useGetCurrentUser();
    const role = userData?.role;

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/login');
        } else if (!allowedRoles.includes(role!)) {
          router.push('/unauthorized'); // or redirect to a specific dashboard
        }
      }
    }, [user, role, loading, router]);

    if (loading || !user || !allowedRoles.includes(role!)) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };

  // Set the display name for the wrapped component
  //AuthenticatedComponent.displayName = `WithAuth(${Component.displayName || Component.name || 'Component'})`;

  return AuthenticatedComponent;
};
