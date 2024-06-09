'use client'

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGetCurrentUser } from '../hooks/useUsers';

export const RoleRouter = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: user } = useGetCurrentUser();

  
  if (user?.role === 'client') {
    router.push('/client/dashboard3');
  } else if (user?.role === 'agent') {
    router.push('/agent/dashboard');
  }
  

  return <>{children}</>;
};
