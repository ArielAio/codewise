import React, { useState } from 'react';
import { auth, db } from '../lib/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Verifica se as senhas coincidem
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Cria um novo documento para o usuário no Firestore
            const newUserRef = doc(db, 'users', user.uid);
            await setDoc(newUserRef, {
                email: user.email,
                permission: 'user',
            });

            console.log('Usuário registrado com sucesso:', user.uid);
            router.push('/login'); // Redireciona para login após o registro
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthError = (error) => {
        switch (error.code) {
            case 'auth/email-already-in-use':
                setError('Este email já está em uso. Por favor, escolha outro email.');
                break;
            case 'auth/invalid-email':
                setError('O email fornecido não é válido. Por favor, insira um email válido.');
                break;
            case 'auth/operation-not-allowed':
                setError('A operação não é permitida. Por favor, contate o suporte.');
                break;
            case 'auth/weak-password':
                setError('A senha deve ter pelo menos 6 caracteres. Por favor, insira uma senha mais forte.');
                break;
            case 'auth/too-many-requests':
                setError('Você fez muitas tentativas de registro. Por favor, tente novamente mais tarde.');
                break;
            default:
                setError('Erro ao registrar usuário. Por favor, tente novamente.');
                break;
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Registrar Usuário</h2>
            <form onSubmit={handleRegister} className="bg-white shadow-lg rounded-lg px-8 py-6 w-96">
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
                    className="border border-gray-300 rounded w-full py-3 px-4 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                    type="password"
                    placeholder="Confirme a Senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="border border-gray-300 rounded w-full py-3 px-4 mb-6 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-green-600 text-white font-bold py-2 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'} transition duration-200`}
                >
                    {loading ? 'Carregando...' : 'Registrar'}
                </button>
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </form>
            <p className="mt-4 text-gray-600">
                Já tem uma conta? 
                <Link href="/login" className="text-green-600 font-semibold hover:underline">  Entrar</Link>
            </p>
        </div>
    );
};

export default RegisterForm;
