import { useAuth } from '../lib/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.permission !== 'admin') {
            router.push('/');
          }
        } else {
          router.push('/');
        }
      } else if (user.permission !== 'admin') {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.permission !== 'admin') {
    return <LoadingSpinner />;
  }

  return children;
};

export default AdminRoute;