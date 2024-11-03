import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
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
        <h1 className="text-4xl font-bold mb-8 text-center text-[#001a33]">Login</h1>
        <form onSubmit={handleSubmit}>
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
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#00FA9A] text-white font-bold py-2 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#33FBB1]'} transition duration-200`}
          >
            {loading ? 'Carregando...' : 'Entrar'}
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
          Não tem uma conta? 
          <Link href="/register" className="text-[#00FA9A] font-semibold hover:underline"> Cadastrar</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
