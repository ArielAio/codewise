import React, { useState } from 'react';
import { auth, db } from '../lib/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                email: user.email,
                permission: 'user',
            });

            console.log('Usuário registrado com sucesso:', user.uid);
            router.push('/login'); // Redirect to login after registration
        } catch (error) {
            setError(error.message);
            console.error('Erro ao registrar usuário:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrar Usuário</h2>
            <form onSubmit={handleRegister} className="bg-white shadow-md rounded px-8 py-6 w-80">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border border-gray-300 rounded w-full py-2 px-3 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border border-gray-300 rounded w-full py-2 px-3 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-green-500 text-white font-bold py-2 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'} transition duration-200`}
                >
                    {loading ? 'Carregando...' : 'Registrar'}
                </button>
            </form>
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
};

export default RegisterForm;
