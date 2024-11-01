import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebaseConfig';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser({ ...user, permission: userDoc.data().permission });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Função para realizar o logout
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null); // Reseta o estado do usuário após o logout
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);
