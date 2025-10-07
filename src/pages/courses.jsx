import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import CourseList from '../components/CourseList';
import { useAuth } from '../lib/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

export default function Cursos() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
        <Head>
          <title>Cursos - CodeWise</title>
        </Head>

        <main className="container mx-auto px-4 py-8">
          <header className="text-center mb-16 bg-gradient-to-r from-[#001a2c] to-[#002d4a] py-12 rounded-xl shadow-lg">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#00FA9A]">
              {user?.permission === 'admin' ? 'Gerenciar Cursos' : 'Cursos Disponíveis'}
            </h1>
            <p className="text-lg sm:text-xl text-slate-100 px-4">
              {user?.permission === 'admin' 
                ? 'Gerencie os cursos da plataforma' 
                : 'Explore nossa seleção de cursos e comece sua jornada de aprendizado'
              }
            </p>
          </header>

        <div className="mb-8 flex flex-col sm:flex-row justify-center items-stretch sm:items-center space-y-4 sm:space-y-0 bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-slate-200/50 shadow-sm">
          <input
            type="text"
            placeholder="Buscar por nome de curso"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00FA9A] focus:ring-2 focus:ring-[#00FA9A]/20 transition-colors text-slate-800 w-full sm:w-auto max-w-md bg-white shadow-sm"
          />
        </div>

        <section className="mb-16">
          <CourseList searchTerm={searchTerm} />
        </section>

        <section className="text-center mb-16 bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-slate-200/50 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-slate-800">Não encontrou o que procura?</h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-slate-600 px-4">Entre em contato conosco e sugira novos cursos!</p>
          <Link href="/contact">
            <div className="bg-gradient-to-r from-[#00FA9A] to-[#33FBB1] text-[#001a2c] px-8 py-4 rounded-full text-xl font-bold inline-block transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 cursor-pointer shadow-md">
              Fale Conosco
            </div>
          </Link>
        </section>
        </main>
        
        <footer className="text-center py-8 bg-[#001a33] text-white mt-16">
          <p>&copy; 2024 CodeWise. Transformando vidas através da programação.</p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
