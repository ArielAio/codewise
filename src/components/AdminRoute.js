import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';

const AdminRoute = ({ children }) => {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        const checkAdmin = async () => {
            if (user === null) {
                // Se o estado do usuário ainda não foi determinado, não faça nada
                return;
            }

            if (!user) {
                // Se o usuário não estiver logado, redirecionar para a página de login
                router.push('/login');
                return;
            }

            // Verificar se o usuário é administrador
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists() || userDoc.data().permission !== 'admin') {
                // Se o usuário não for administrador, redirecionar para uma página de erro ou home
                router.push('/');
                return;
            }
        };

        checkAdmin();
    }, [user, router]);

    return user ? children : null;
};

export default AdminRoute;