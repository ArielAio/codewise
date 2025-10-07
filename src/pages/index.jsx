//imports
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { db } from '../lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/AuthContext';

export default function Home() {
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const cursosCollection = collection(db, 'cursos');
        const cursosSnapshot = await getDocs(cursosCollection);
        const cursosList = cursosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCursos(cursosList);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();

    const interval = setInterval(() => {
      nextCourse();
    }, 3000);

    return () => clearInterval(interval);
  }, [cursos.length]);

  const nextCourse = () => {
    if (cursos.length > 0) {
      setCurrentCourseIndex((prevIndex) => (prevIndex + 1) % cursos.length);
    }
  };

  const prevCourse = () => {
    if (cursos.length > 0) {
      setCurrentCourseIndex((prevIndex) => (prevIndex - 1 + cursos.length) % cursos.length);
    }
  };

  const usedEmojis = new Set();

  const getRandomEmoji = () => {
    const emojis = ['💻', '👨‍💻', '👩‍💻', '🖥️', '📱', '🧑‍💻', '🔧', '🛠️', '📊', '📈', '💡', '🧩'];
    const availableEmojis = emojis.filter(emoji => !usedEmojis.has(emoji));

    if (availableEmojis.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableEmojis.length);
    const selectedEmoji = availableEmojis[randomIndex];
    usedEmojis.add(selectedEmoji);
    return selectedEmoji;
  };

  const handleExploreCourses = () => {
    router.push('/courses');
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Bom dia';
    if (hours < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-[#001a33]">
      <Head>
        <title>Home - CodeWise</title>
      </Head>

      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-16 bg-[#001a33] py-8 rounded-lg shadow-lg">
          {user && (
            <h1 className="text-4xl font-bold mb-4 text-[#00FA9A]">
              {getGreeting()}, {user.name || 'Aluno'}!
            </h1>
          )}
          <h1 className="text-4xl font-bold mb-4 text-[#00FA9A]">Bem-vindo ao CodeWise</h1>
          <p className="text-xl text-white">Transformando vidas através da programação</p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-[#001a33]">Cursos em Destaque</h2>

          {loading ? (
            <div className="bg-gray-300 h-32 rounded-lg animate-pulse"></div>
          ) : cursos.length > 0 ? (
            <div className="text-center mb-4">
              <div className="inline-block transition-all duration-500 ease-in-out transform hover:scale-110 cursor-pointer">
                <div className="flex flex-col items-center">
                  <Link href={`/courses/${cursos[currentCourseIndex]?.id}`}>
                    <span className="text-6xl mb-2 inline-block">
                      {getRandomEmoji()}
                    </span>
                  </Link>
                  <h3 className="text-2xl font-semibold text-[#001a33]">
                    <Link href={`/courses/${cursos[currentCourseIndex]?.id}`}>
                      {cursos.length > 0 ? cursos[currentCourseIndex]?.title : 'Curso Indisponível'}
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-lg text-[#001a33]">Nenhum curso disponível no momento.</p>
          )}
        </section>

        <section className="text-center mb-16 bg-[#001a33] py-12 px-4 rounded-lg shadow-lg">
          <h2 className="text-4xl font-semibold mb-10 text-[#00FA9A]">Por que escolher a CodeWise?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: 'Aprendizado Tranquilo', description: 'Ambiente sereno para melhor absorção do conteúdo', icon: '🧘' },
              { title: 'Suporte Personalizado', description: 'Mentoria individual para seu progresso', icon: '👨‍🏫' },
              { title: 'Projetos Práticos', description: 'Aplique seus conhecimentos em casos reais', icon: '🛠️' },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 flex flex-col items-center">
                <span className="text-5xl mb-4 inline-block">{feature.icon}</span>
                <h3 className="text-xl font-semibold mb-3 text-[#001a33]">{feature.title}</h3>
                <p className="text-[#001a33] text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center mb-16">
          <button
            onClick={handleExploreCourses}
            className="bg-[#00FA9A] text-[#001a33] px-8 py-4 rounded-full text-xl font-bold inline-block transition-all duration-300 hover:bg-[#33FBB1] hover:shadow-lg transform hover:-translate-y-1 hover:scale-105"
          >
            Explorar Cursos
          </button>
        </section>

        <section className="bg-[#001a33] rounded-lg p-8 shadow-lg text-white">
          <h2 className="text-3xl font-semibold mb-6 text-center text-[#00FA9A]">Depoimentos de Alunos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'Paulo Mazuque', comment: 'A CodeWise mudou minha vida. O ambiente tranquilo de aprendizado me ajudou a focar e progredir rapidamente.' },
              { name: 'Pedro Colavite', comment: 'Os projetos práticos da CodeWise me deram confiança para iniciar minha carreira como desenvolvedor.' },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <p className="italic mb-2 text-[#001a33]">"{testimonial.comment}"</p>
                <p className="font-semibold text-[#00FA9A]">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="text-center py-8 bg-[#001a33] text-white mt-16">
        <p>&copy; 2024 CodeWise. Transformando vidas através da programação.</p>
      </footer>
    </div>
  );
}
