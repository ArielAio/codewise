import { useState } from 'react';
import { auth } from '../lib/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setEmail('');
            setPassword('');
            router.push('/'); // Redireciona para a página inicial após o login
        } catch (err) {
            handleAuthError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthError = (error) => {
        switch (error.code) {
            case 'auth/user-not-found':
                setError('Nenhum usuário encontrado com este email. Por favor, verifique ou crie uma conta.');
                break;
            case 'auth/wrong-password':
                setError('A senha está incorreta. Por favor, tente novamente.');
                break;
            case 'auth/invalid-email':
                setError('O email fornecido não é válido. Por favor, insira um email válido.');
                break;
            case 'auth/user-disabled':
                setError('Este usuário foi desativado. Entre em contato com o suporte.');
                break;
            case 'auth/too-many-requests':
                setError('Você fez muitas tentativas de login. Por favor, tente novamente mais tarde.');
                break;
            default:
                setError('Erro ao tentar fazer login. Por favor, tente novamente.');
                break;
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Login</h1>
            <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-lg px-8 py-6 w-96">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border border-gray-300 rounded w-full py-3 px-4 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border border-gray-300 rounded w-full py-3 px-4 mb-6 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-green-600 text-white font-bold py-2 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'} transition duration-200`}
                >
                    {loading ? 'Carregando...' : 'Login'}
                </button>
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </form>
            <p className="mt-4 text-gray-600">
                Não tem uma conta? 
                <Link href="/register" className="text-green-600 font-semibold hover:underline"> Cadastrar</Link>
            </p>
        </div>
    );
}
