import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Extract name from email if name is not provided
      const userName = name || email.split('@')[0];

      // Save user name and permission in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: userName,
        email,
        permission: 'user', // Default permission
      });

      router.push('/');
    } catch (error) {
      setError('Erro ao registrar. Verifique suas informações.');
      console.error('Erro ao registrar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user name and permission in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        permission: 'user', // Default permission
      });

      router.push('/');
    } catch (error) {
      setError('Erro ao fazer login com o Google.');
      console.error('Erro ao fazer login com o Google:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#001a33]">Registrar</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded w-full py-3 px-4 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-[#00FA9A]"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded w-full py-3 px-4 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-[#00FA9A]"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded w-full py-3 px-4 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-[#00FA9A]"
          />
          <input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border border-gray-300 rounded w-full py-3 px-4 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-[#00FA9A]"
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#00FA9A] text-white font-bold py-2 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#33FBB1]'} transition duration-200`}
          >
            {loading ? 'Carregando...' : 'Registrar'}
          </button>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`mt-4 bg-[#4285F4] text-white font-bold py-2 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#357AE8]'} transition duration-200`}
          >
            {loading ? 'Carregando...' : 'Entrar com o Google'}
          </button>
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </form>
        <p className="mt-4 text-gray-600 text-center">
          Já tem uma conta? 
          <Link href="/login" className="text-[#00FA9A] font-semibold hover:underline"> Entrar</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
