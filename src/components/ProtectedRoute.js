import { useAuth } from '../lib/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login'); // Redireciona para login se não autenticado
    }
  }, [user, router]);

  return <>{user ? children : null}</>;
};

export default ProtectedRoute;
