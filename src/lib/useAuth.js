// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig'; // supondo que auth está configurado em firebaseConfig.js

export function useAuth() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  
  const logout = async () => {
    await signOut(auth);
  };
  
  return { user, logout };
}
